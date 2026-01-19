import { runTextMarkdownConversion } from "../services/orchestrator/textMarkdownOrchestrator.js";
import { runDocxToMarkdownConversion } from "../services/orchestrator/docxToMarkdownOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";



export async function textToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'text-to-md');

        const result = await runTextMarkdownConversion({
            inputFile: req.file,
            sourceFormat: 'text',
            targetFormat: 'md'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('text to md conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function mdToTextController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'md-to-text');

        const result = await runTextMarkdownConversion({
            inputFile: req.file,
            sourceFormat: 'md',
            targetFormat: 'text'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to text conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function mdToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'md-to-html');

        const result = await runTextMarkdownConversion({
            inputFile: req.file,
            sourceFormat: 'md',
            targetFormat: 'html'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to html conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function htmlToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'html-to-md');

        const result = await runTextMarkdownConversion({
            inputFile: req.file,
            sourceFormat: 'html',
            targetFormat: 'md'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to md conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function docxToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }

        // Validate file type
        validateFileType(req.file, 'docx-to-md');

        const result = await runDocxToMarkdownConversion({
            inputFile: req.file
        });

        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);

        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to md conversion error:', error);
        if (error.isOperational) {
            return next(error);
        }
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
