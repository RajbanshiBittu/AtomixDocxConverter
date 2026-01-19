import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

//custom error class
export class AppError extends Error {
    constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

//custom error handling middleware
export const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Set default values if not provided
    statusCode = statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = message || ERROR_MESSAGES.INTERNAL_ERROR;

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};