import logger from './logger.js';

/**
 * Validates that all required environment variables are set
 * @throws {Error} If required variables are missing
 */
export function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // Required variables for production
  const requiredVars = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
  };

  // Recommended variables for production
  const recommendedVars = {
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STORAGE_BASE_PATH: process.env.STORAGE_BASE_PATH,
    UPLOAD_PATH: process.env.UPLOAD_PATH,
    OUTPUT_PATH: process.env.OUTPUT_PATH,
    WORKING_PATH: process.env.WORKING_PATH,
  };

  // Optional variables
  const optionalVars = {
    FRONTEND_URL_WWW: process.env.FRONTEND_URL_WWW,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_DIR: process.env.LOG_DIR,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    LIBREOFFICE_TIMEOUT: process.env.LIBREOFFICE_TIMEOUT,
    CLEANUP_ENABLED: process.env.CLEANUP_ENABLED,
    CLEANUP_MAX_AGE: process.env.CLEANUP_MAX_AGE,
    CLEANUP_INTERVAL: process.env.CLEANUP_INTERVAL,
  };

  // Check required variables
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  // Check recommended variables
  for (const [key, value] of Object.entries(recommendedVars)) {
    if (!value) {
      warnings.push(`Missing recommended environment variable: ${key}`);
    }
  }

  // Validate NODE_ENV
  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    warnings.push(`Invalid NODE_ENV value: ${process.env.NODE_ENV}. Expected: development, production, or test`);
  }

  // Validate PORT is a number
  if (process.env.PORT && isNaN(Number(process.env.PORT))) {
    errors.push('PORT must be a valid number');
  }

  // Validate URLs
  if (process.env.FRONTEND_URL) {
    try {
      new URL(process.env.FRONTEND_URL);
    } catch (e) {
      errors.push(`Invalid FRONTEND_URL: ${process.env.FRONTEND_URL}`);
    }
  }

  if (process.env.FRONTEND_URL_WWW) {
    try {
      new URL(process.env.FRONTEND_URL_WWW);
    } catch (e) {
      errors.push(`Invalid FRONTEND_URL_WWW: ${process.env.FRONTEND_URL_WWW}`);
    }
  }

  // Production-specific checks (only if actually deployed to production)
  // Allow localhost for local production testing (NODE_ENV=production on dev machine)
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.FRONTEND_URL) {
      warnings.push('FRONTEND_URL is recommended in production environment');
    }
    // Only warn about localhost in production if HOST is not localhost/127.0.0.1
    if (process.env.FRONTEND_URL && 
        process.env.FRONTEND_URL.includes('localhost') && 
        process.env.HOST !== 'localhost' && 
        process.env.HOST !== '127.0.0.1') {
      warnings.push('FRONTEND_URL uses localhost but HOST is not local - this may cause CORS issues');
    }
  }

  // Report results
  if (errors.length > 0) {
    logger.error('❌ Environment validation failed:');
    errors.forEach(err => logger.error(`  - ${err}`));
    throw new Error(`Environment validation failed with ${errors.length} error(s)`);
  }

  if (warnings.length > 0) {
    logger.warn('⚠️  Environment validation warnings:');
    warnings.forEach(warn => logger.warn(`  - ${warn}`));
  }

  // Log success
  const totalVars = Object.keys(requiredVars).length + 
                    Object.keys(recommendedVars).length + 
                    Object.keys(optionalVars).length;
  const setVars = [...Object.values(requiredVars), ...Object.values(recommendedVars), ...Object.values(optionalVars)]
    .filter(Boolean).length;

  logger.info(`✅ Environment validation passed (${setVars}/${totalVars} variables set)`);
  
  // Log current configuration
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Current configuration:');
    logger.info(`  - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    logger.info(`  - PORT: ${process.env.PORT}`);
    logger.info(`  - HOST: ${process.env.HOST}`);
    logger.info(`  - FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
  }
}

export default validateEnvironment;
