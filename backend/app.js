import express from "express";
import cors from "cors";
import helmet from 'helmet';
import { HTTP_STATUS } from './config/constants.js';
import { errorHandler } from './utils/errorHandler.js';
import rateLimit from 'express-rate-limit';
import checkLibreOffice from "./utils/systemCheck.js";
import timeout from 'connect-timeout';


//Import routes here
import { officeToPdfRouter } from './routes/officeToPdf.routes.js';
import { openDocumentsRouter } from './routes/openDocuments.routes.js';
import { structuredDataRouter } from './routes/structuredData.routes.js';
import { textMarkdownRouter } from './routes/textMarkdown.routes.js';
import { pdfToOfficeRouter } from './routes/pdfToOffice.routes.js';
import { comprehensiveConversionRouter } from './routes/comprehensiveConversion.routes.js';
import logger from "./utils/logger.js";


const application = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
  'https://atomixtools.com',
  'https://www.atomixtools.com'
].filter(Boolean);

// In development, allow localhost and 127.0.0.1 on various ports
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  allowedOrigins.push(
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  );
}

// Middleware setup
const bodyLimit = process.env.BODY_LIMIT || '10mb';
application.use(express.json({ limit: bodyLimit }));
application.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Security headers
application.use(helmet());

application.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      logger.debug('Request with no origin - allowing');
      return callback(null, true);
    }
    
    logger.debug(`CORS check for origin: ${origin}`);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      logger.debug(`Origin ${origin} is allowed`);
      callback(null, true);
    } else {
      logger.warn(`Origin ${origin} is not allowed. Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Request logging middleware
application.use((req, res, next) => {
    logger.info(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

const requestTimeout = process.env.REQUEST_TIMEOUT || '300s';
application.use(timeout(requestTimeout));
application.use((req, res, next) => {
  if (!req.timedout) next();
});

application.use((req, res, next) => {
  if (req.timedout) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        message: 'Request timeout - file may be too large or complex'
      }
    });
  } else {
    next();
  }
});

// Liveness probe - checks if application is running
application.get('/healthz', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe - checks if application is ready to serve requests
application.get('/ready', async (req, res) => {
  try {
    const libreOffice = await checkLibreOffice();
    
    if (!libreOffice.available) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: 'not ready',
        message: 'LibreOffice is not available',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      status: 'ready',
      message: 'Document Converter API is ready',
      timestamp: new Date().toISOString(),
      dependencies: {
        libreOffice: {
          available: true,
          version: libreOffice.version || 'unknown'
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: 'not ready',
      message: 'Error checking dependencies',
      timestamp: new Date().toISOString()
    });
  }
});

// Backward compatibility - keep old /health endpoint
application.get('/health', async (req, res) => {
  const libreOffice = await checkLibreOffice();
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Document Converter API is running',
    timestamp: new Date().toISOString(),
    dependencies: {
      libreOffice: libreOffice.available ? 'available' : 'unavailable',
      version: libreOffice.version || 'unknown'
    }
  });
});


// API Info endpoint
application.get('/api', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Document Converter API',
        version: '1.0.0',
        documentation: {
            endpoints: {
                officeToPdf: '/api/v1/office-to-pdf/*',
                openDocuments: '/api/v1/open-documents/*',
                structuredData: '/api/v1/structured-data/*',
                textMarkdown: '/api/v1/text-markdown/*',
                pdfToOffice: '/api/v1/pdf-to-office/*',
                comprehensiveConversions: '/api/v1/conversions/*'
            }
        }
    });
});


// Root route - helpful for browser visits to '/'
application.get('/', (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Document Converter API. See /api for endpoints',
        timestamp: new Date().toISOString()
    });
});


// General API rate limiter
const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000; // 15 minutes default
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

const apiLimiter = rateLimit({
  windowMs: rateLimitWindow,
  max: rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for conversion endpoints
const conversionLimitMax = parseInt(process.env.CONVERSION_RATE_LIMIT) || 50;

const conversionLimiter = rateLimit({
  windowMs: rateLimitWindow,
  max: conversionLimitMax,
  message: 'Too many conversion requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
application.use('/api/', apiLimiter);
application.use('/api/v1/', conversionLimiter);

//Mount routes here
application.use("/api/v1/office-to-pdf", officeToPdfRouter);
application.use("/api/v1/open-documents", openDocumentsRouter);
application.use("/api/v1/structured-data", structuredDataRouter);
application.use("/api/v1/text-markdown", textMarkdownRouter)
application.use("/api/v1/conversions", comprehensiveConversionRouter);;
application.use("/api/v1/pdf-to-office", pdfToOfficeRouter);



// 404 handler
application.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
            message: 'Route not found',
            path: req.path
        }
    });
});

// Global error handler (must be last)
application.use(errorHandler);

export default application;