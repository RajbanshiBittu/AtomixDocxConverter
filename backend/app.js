import express from "express";
import cors from "cors";
import { HTTP_STATUS } from './config/constants.js';
import { errorHandler } from './utils/errorHandler.js';


//Import routes here
import { officeToPdfRouter } from './routes/officeToPdf.routes.js';
import { openDocumentsRouter } from './routes/openDocuments.routes.js';
import { structuredDataRouter } from './routes/structuredData.routes.js';
import { textMarkdownRouter } from './routes/textMarkdown.routes.js';
import { pdfToOfficeRouter } from './routes/pdfToOffice.routes.js';


const application = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
application.use(cors({origin: FRONTEND_URL}));
application.use(express.json());


// Request logging middleware
application.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
application.get('/health', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Document Converter API is running',
        timestamp: new Date().toISOString()
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
                pdfToOffice: '/api/v1/pdf-to-office/*'
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


//Mount routes here
application.use("/api/v1/office-to-pdf", officeToPdfRouter);
application.use("/api/v1/open-documents", openDocumentsRouter);
application.use("/api/v1/structured-data", structuredDataRouter);
application.use("/api/v1/text-markdown", textMarkdownRouter);
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