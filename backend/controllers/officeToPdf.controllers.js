import { runConversion } from "../services/orchestrator/conversionOrchestrator.js";
import { runHtmlToPdfConversion } from "../services/orchestrator/htmlToPdfOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";



export async function docxToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'docx-to-pdf');

        const result = await runConversion({
            inputFile: req.file,
            targetFormat: 'pdf'
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'xlsx-to-pdf');

        const result = await runConversion({
            inputFile: req.file,
            targetFormat: 'pdf'
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pptxToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'pptx-to-pdf');

        const result = await runConversion({
            inputFile: req.file,
            targetFormat: 'pdf'
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('pptx to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odsToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'ods-to-pdf');

        const result = await runConversion({
            inputFile: req.file,
            targetFormat: 'pdf'
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('ods to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odtToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'odt-to-pdf');

        const result = await runConversion({
            inputFile: req.file,
            targetFormat: 'pdf'
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function htmlToPdfController (req, res, next) {
    try {
        if(!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'html-to-pdf');

        const result = await runHtmlToPdfConversion({
            inputFile: req.file
        })

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to pdf conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

