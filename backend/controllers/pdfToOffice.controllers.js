import { runPdfToTextConversion } from "../services/orchestrator/pdfToOfficeTextOrchestrator.js";
import { runPdfToDocxConversion } from "../services/orchestrator/pdfToOfficeDocxOrchestrator.js";
import { runPdfToXlsxConversion } from "../services/orchestrator/pdfToOfficeXlsxOrchestrator.js";
import { runPdfToJsonConversion } from "../services/orchestrator/pdfToOfficeJsonOrchestrator.js";
import { runPdfToCsvConversion } from "../services/orchestrator/pdfToOfficeCsvOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";
import logger from "../utils/logger.js";
import { sanitizeFilename } from "../utils/sanitizer.js";


export async function pdfToTextController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-text');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runPdfToTextConversion({
            inputFile: req.file,
            mode: req.query.mode || 'fast'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '.txt')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('PDF to text conversion error:', error);
        logger.error('PDF to text conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pdfToDocxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-docx');
        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runPdfToDocxConversion({
            inputFile: req.file,
            mode: req.query.mode || 'fast'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '.docx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('PDF to docx conversion error:', error);
        logger.error('PDF to docx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pdfToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-xlsx');
        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runPdfToXlsxConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '.xlsx')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('PDF to xlsx conversion error:', error);
        logger.error('PDF to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pdfToJsonController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-json');

        const sanitizedName = sanitizeFilename(req.file.originalname);

        const result = await runPdfToJsonConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '.json')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('PDF to json conversion error:', error);
        logger.error('PDF to json conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pdfToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-csv');
        const sanitizedName = sanitizeFilename(req.file.originalname);
        const result = await runPdfToCsvConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName.replace(/\.pdf$/i, '.csv')}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        // console.error('PDF to csv conversion error:', error);
        logger.error('PDF to csv conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
