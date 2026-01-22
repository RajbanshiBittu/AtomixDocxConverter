import { runOpenDocumentConversion } from "../services/orchestrator/openDocumentOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";
import logger from "../utils/logger.js";
import { sanitizeFilename } from "../utils/sanitizer.js";


export async function docxToOdtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'docx-to-odt');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'odt'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.docx$/i, '.odt')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('docx to odt conversion error:', error);
        logger.error('docx to odt conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odtToDocxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'odt-to-docx');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'docx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.odt$/i, '.docx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('odt to docx conversion error:', error);
        logger.error('odt to docx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToOdsController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'xlsx-to-ods');
        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'ods'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.xlsx$/i, '.ods')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('xlsx to ods conversion error:', error);
        logger.error('xlsx to ods conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odsToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'ods-to-xlsx');
        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.ods$/i, '.xlsx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('ods to xlsx conversion error:', error);
        logger.error('ods to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
