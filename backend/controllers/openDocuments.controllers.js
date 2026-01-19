import { runOpenDocumentConversion } from "../services/orchestrator/openDocumentOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";

export async function docxToOdtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'docx-to-odt');

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'odt'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to odt conversion error:', error);
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

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'docx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to docx conversion error:', error);
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

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'ods'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to ods conversion error:', error);
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

        const result = await runOpenDocumentConversion({
            inputFile: req.file,
            targetFormat: 'xlsx'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('ods to xlsx conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
