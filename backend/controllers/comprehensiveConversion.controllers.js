import { comprehensiveConversionOrchestrator } from "../services/orchestrator/comprehensiveConversionOrchestrator.js";
import { AppError } from "../utils/errorHandler.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config/constants.js";
import path from "path";
import { validateFileType } from "../utils/fileValidator.js";

/**
 * Controllers for all 43 new conversions
 * Each controller follows the same pattern: validate, convert, respond
 */

// ==================== DOCX CONVERSIONS (4) ====================

export async function docxToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'docx-to-txt');
        const result = await comprehensiveConversionOrchestrator.docxToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function docxToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'docx-to-html');
        const result = await comprehensiveConversionOrchestrator.docxToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function docxToPptxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'docx-to-pptx');
        const result = await comprehensiveConversionOrchestrator.docxToPptx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to pptx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function docxToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'docx-to-xlsx');
        const result = await comprehensiveConversionOrchestrator.docxToXlsx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('docx to xlsx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== PPTX CONVERSIONS (3) ====================

export async function pptxToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'pptx-to-txt');
        const result = await comprehensiveConversionOrchestrator.pptxToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('pptx to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pptxToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'pptx-to-html');
        const result = await comprehensiveConversionOrchestrator.pptxToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('pptx to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function pptxToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'pptx-to-md');
        const result = await comprehensiveConversionOrchestrator.pptxToMd(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('pptx to md conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== TXT CONVERSIONS (4) ====================

export async function txtToDocxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'txt-to-docx');
        const result = await comprehensiveConversionOrchestrator.txtToDocx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('txt to docx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function txtToPdfController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'txt-to-pdf');
        const result = await comprehensiveConversionOrchestrator.txtToPdf(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('txt to pdf conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function txtToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'txt-to-html');
        const result = await comprehensiveConversionOrchestrator.txtToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('txt to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function txtToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'txt-to-md');
        const result = await comprehensiveConversionOrchestrator.txtToMd(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('txt to md conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== PDF CONVERSIONS (1) ====================

export async function pdfToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'pdf-to-html');
        const result = await comprehensiveConversionOrchestrator.pdfToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('pdf to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== MARKDOWN CONVERSIONS (4) ====================

export async function mdToPdfController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'md-to-pdf');
        const result = await comprehensiveConversionOrchestrator.mdToPdf(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to pdf conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function mdToDocxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'md-to-docx');
        const result = await comprehensiveConversionOrchestrator.mdToDocx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to docx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function mdToOdtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'md-to-odt');
        const result = await comprehensiveConversionOrchestrator.mdToOdt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to odt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function mdToPptxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'md-to-pptx');
        const result = await comprehensiveConversionOrchestrator.mdToPptx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('md to pptx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== XLSX CONVERSIONS (4) ====================

export async function xlsxToJsonController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xlsx-to-json');
        const result = await comprehensiveConversionOrchestrator.xlsxToJson(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to json conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToXmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xlsx-to-xml');
        const result = await comprehensiveConversionOrchestrator.xlsxToXml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to xml conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xlsx-to-html');
        const result = await comprehensiveConversionOrchestrator.xlsxToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xlsxToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xlsx-to-txt');
        const result = await comprehensiveConversionOrchestrator.xlsxToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xlsx to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== ODS CONVERSIONS (3) ====================

export async function odsToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'ods-to-csv');
        const result = await comprehensiveConversionOrchestrator.odsToCsv(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('ods to csv conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odsToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'ods-to-html');
        const result = await comprehensiveConversionOrchestrator.odsToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('ods to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odsToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'ods-to-txt');
        const result = await comprehensiveConversionOrchestrator.odsToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('ods to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== ODT CONVERSIONS (4) ====================

export async function odtToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'odt-to-txt');
        const result = await comprehensiveConversionOrchestrator.odtToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odtToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'odt-to-html');
        const result = await comprehensiveConversionOrchestrator.odtToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odtToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'odt-to-md');
        const result = await comprehensiveConversionOrchestrator.odtToMd(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to md conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function odtToPptxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'odt-to-pptx');
        const result = await comprehensiveConversionOrchestrator.odtToPptx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('odt to pptx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== CSV CONVERSIONS (4) ====================

export async function csvToXmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'csv-to-xml');
        const result = await comprehensiveConversionOrchestrator.csvToXml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to xml conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'csv-to-html');
        const result = await comprehensiveConversionOrchestrator.csvToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToPdfController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'csv-to-pdf');
        const result = await comprehensiveConversionOrchestrator.csvToPdf(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to pdf conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function csvToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'csv-to-txt');
        const result = await comprehensiveConversionOrchestrator.csvToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('csv to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== JSON CONVERSIONS (4) ====================

export async function jsonToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'json-to-csv');
        const result = await comprehensiveConversionOrchestrator.jsonToCsv(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to csv conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function jsonToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'json-to-xlsx');
        const result = await comprehensiveConversionOrchestrator.jsonToXlsx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to xlsx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function jsonToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'json-to-html');
        const result = await comprehensiveConversionOrchestrator.jsonToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function jsonToMdController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'json-to-md');
        const result = await comprehensiveConversionOrchestrator.jsonToMd(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('json to md conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== XML CONVERSIONS (4) ====================

export async function xmlToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xml-to-csv');
        const result = await comprehensiveConversionOrchestrator.xmlToCsv(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to csv conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xmlToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xml-to-xlsx');
        const result = await comprehensiveConversionOrchestrator.xmlToXlsx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to xlsx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xmlToHtmlController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xml-to-html');
        const result = await comprehensiveConversionOrchestrator.xmlToHtml(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to html conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function xmlToPdfController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'xml-to-pdf');
        const result = await comprehensiveConversionOrchestrator.xmlToPdf(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('xml to pdf conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

// ==================== HTML CONVERSIONS (4) ====================

export async function htmlToDocxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'html-to-docx');
        const result = await comprehensiveConversionOrchestrator.htmlToDocx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to docx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function htmlToTxtController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'html-to-txt');
        const result = await comprehensiveConversionOrchestrator.htmlToTxt(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to txt conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function htmlToXlsxController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'html-to-xlsx');
        const result = await comprehensiveConversionOrchestrator.htmlToXlsx(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to xlsx conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}

export async function htmlToCsvController(req, res, next) {
    try {
        if (!req.file) {
            return next(new AppError(ERROR_MESSAGES.FILE_NOT_FOUND, HTTP_STATUS.BAD_REQUEST));
        }
        validateFileType(req.file, 'html-to-csv');
        const result = await comprehensiveConversionOrchestrator.htmlToCsv(req.file);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(result.outputPath)}"`);
        return res.status(HTTP_STATUS.OK).download(result.outputPath);
    } catch (error) {
        console.error('html to csv conversion error:', error);
        if (error.isOperational) return next(error);
        return next(new AppError(ERROR_MESSAGES.CONVERSION_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}
