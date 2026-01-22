import application from "./app.js";
import dotenv from "dotenv";
import cron from 'node-cron';
import checkLibreOffice from "./utils/systemCheck.js";
import logger from "./utils/logger.js";
import validateEnvironment from "./utils/validateEnv.js";

dotenv.config();

// Validate environment variables before starting
validateEnvironment();

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";

const libreOfficeStatus = await checkLibreOffice();

if (!libreOfficeStatus.available) {
    logger.error('CRITICAL: LibreOffice is not available');
    logger.error('Please install LibreOffice: https://www.libreoffice.org/');
    process.exit(1);
}

logger.info(`LibreOffice available: ${libreOfficeStatus.version}`);

const server = application.listen(PORT, HOST, () => {
    logger.info('='.repeat(50));
    logger.info('Document Converter Backend API Server');
    logger.info('='.repeat(50));
    logger.info(`Server running on: http://${HOST}:${PORT}`);
    logger.info(`Started at: ${new Date().toISOString()}`);
    logger.info('='.repeat(50));
});


// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

cron.schedule('*/30 * * * *', async () => {
  logger.info('Starting scheduled cleanup...');
  
  const directories = [
    STORAGE_PATHS.UPLOADS,
    STORAGE_PATHS.OUTPUTS,
    STORAGE_PATHS.WORKING
  ];
  
  const maxAge = parseInt(process.env.CLEANUP_MAX_AGE) || 3600000; // 1 hour
  
  for (const dir of directories) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        const age = Date.now() - stats.mtimeMs;
        
        if (age > maxAge) {
          await fs.rm(filePath, { recursive: true, force: true });
          logger.info(`Cleaned up: ${file} (age: ${Math.round(age/1000/60)}min)`);
        }
      }
    } catch (error) {
      logger.error(`Cleanup error in ${dir}:`, error);
    }
  }
  
  logger.info('Scheduled cleanup completed');
});