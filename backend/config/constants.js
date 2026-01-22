import path from 'path';

// HTTP Status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

// Error messages
export const ERROR_MESSAGES = {
    VALIDATION_ERROR: 'Validation failed',
    CONVERSION_ERROR: 'Conversion failed',
    INVALID_FORMAT: 'Invalid output format',
    INVALID_DATA: 'Invalid data for document type',
    INTERNAL_ERROR: 'Internal server error',
    FILE_NOT_FOUND: 'File not found or not uploaded'
}

export const STORAGE_PATHS = {
  BASE: process.env.STORAGE_BASE_PATH || './storage',
  UPLOADS: process.env.UPLOAD_PATH || './storage/uploads',
  OUTPUTS: process.env.OUTPUT_PATH || './storage/outputs',
  WORKING: process.env.WORKING_PATH || './storage/working'
};

// Helper to resolve absolute paths
export function resolveStoragePath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}