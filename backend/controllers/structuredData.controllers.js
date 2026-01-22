import { runStructuredDataConversion } from "../services/orchestrator/structuredDataOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";
import logger from "../utils/logger.js";
import { sanitizeFilename } from "../utils/sanitizer.js";



export async function jsonToXmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        // Validate file type
        validateFileType(req.file, 'json-to-xml');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'xml'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.json$/i, '.xml')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('json to xml conversion error:', error);
        logger.error('json to xml conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xmlToJsonController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'xml-to-json');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xml',
            targetFormat: 'json'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.xml$/i, '.json')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('xml to json conversion error:', error);
        logger.error('xml to json conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function jsonToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'json-to-csv');

        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.json$/i, '.csv')}"`);
        
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('json to csv conversion error:', error);
        logger.error('json to csv conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToJsonController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'csv-to-json');

        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runStructuredDataConversion({ 
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'json'
        });
        
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.csv$/i, '.json')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('csv to json conversion error:', error);
        logger.error('csv to json conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xmlToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        const sanitizedName = sanitizeFilename(req.file.originalname);

        // Validate file type
        validateFileType(req.file, 'xml-to-csv');

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xml',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.xml$/i, '.csv')}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('xml to csv conversion error:', error);
        logger.error('xml to csv conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToXmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'csv-to-xml');

        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'xml'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.csv$/i, '.xml')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('csv to xml conversion error:', error);
        logger.error('csv to xml conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'xlsx-to-csv');

        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xlsx',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.xlsx$/i, '.csv')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('xlsx to csv conversion error:', error);
        logger.error('xlsx to csv conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'csv-to-xlsx');

        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.csv$/i, '.xlsx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('csv to xlsx conversion error:', error);
        logger.error('csv to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function jsonToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'json-to-xlsx');

        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.json$/i, '.xlsx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('json to xlsx conversion error:', error);
        logger.error('json to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
