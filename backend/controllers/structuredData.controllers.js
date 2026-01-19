import { runStructuredDataConversion } from "../services/orchestrator/structuredDataOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";

export async function jsonToXmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'json-to-xml');

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'xml'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to xml conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xml',
            targetFormat: 'json'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to json conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to csv conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'json'
        });
        
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to json conversion error:', error);
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

        // Validate file type
        validateFileType(req.file, 'xml-to-csv');

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xml',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to csv conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'xml'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to xml conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'xlsx',
            targetFormat: 'csv'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to csv conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'csv',
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to xlsx conversion error:', error);
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

        const result = await runStructuredDataConversion({
            inputFile: req.file,
            sourceFormat: 'json',
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
