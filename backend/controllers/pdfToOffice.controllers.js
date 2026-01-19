import { runPdfToTextConversion } from "../services/orchestrator/pdfToOfficeTextOrchestrator.js";
import { runPdfToDocxConversion } from "../services/orchestrator/pdfToOfficeDocxOrchestrator.js";
import { runPdfToXlsxConversion } from "../services/orchestrator/pdfToOfficeXlsxOrchestrator.js";
import { runPdfToJsonConversion } from "../services/orchestrator/pdfToOfficeJsonOrchestrator.js";
import { runPdfToCsvConversion } from "../services/orchestrator/pdfToOfficeCsvOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";

export async function pdfToTextController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pdf-to-text');

        const result = await runPdfToTextConversion({
            inputFile: req.file,
            mode: req.query.mode || 'fast'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('PDF to text conversion error:', error);
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

        const result = await runPdfToDocxConversion({
            inputFile: req.file,
            mode: req.query.mode || 'fast'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('PDF to docx conversion error:', error);
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

        const result = await runPdfToXlsxConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('PDF to xlsx conversion error:', error);
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

        const result = await runPdfToJsonConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('PDF to json conversion error:', error);
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

        const result = await runPdfToCsvConversion({
            inputFile: req.file,
            mode: req.query.mode || 'structured'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('PDF to csv conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
