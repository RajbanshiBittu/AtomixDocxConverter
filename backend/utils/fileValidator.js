import path from 'path';
import { AppError } from './errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

// File type validation mappings
const FILE_TYPE_RULES = {
    // Office to PDF conversions
    'docx-to-pdf': ['.docx', '.doc'],
    'xlsx-to-pdf': ['.xlsx', '.xls'],
    'pptx-to-pdf': ['.pptx', '.ppt'],
    'odt-to-pdf': ['.odt'],
    'ods-to-pdf': ['.ods'],
    
    // Open Document conversions
    'docx-to-odt': ['.docx', '.doc'],
    'odt-to-docx': ['.odt'],
    'xlsx-to-ods': ['.xlsx', '.xls'],
    'ods-to-xlsx': ['.ods'],
    
    // Structured Data conversions
    'json-to-xml': ['.json'],
    'xml-to-json': ['.xml'],
    'json-to-csv': ['.json'],
    'csv-to-json': ['.csv'],
    'xml-to-csv': ['.xml'],
    'csv-to-xml': ['.csv'],
    
    // Text/Markdown conversions
    'text-to-md': ['.txt'],
    'md-to-text': ['.md'],
    'md-to-html': ['.md'],
    'html-to-md': ['.html', '.htm'],
    'docx-to-md': ['.docx', '.doc'],
    
    // HTML to PDF conversion
    'html-to-pdf': ['.html', '.htm'],
    
    // Spreadsheet conversions
    'xlsx-to-csv': ['.xlsx', '.xls'],
    'csv-to-xlsx': ['.csv'],
    'json-to-xlsx': ['.json'],
    
    // PDF to Office conversions
    'pdf-to-text': ['.pdf'],
    'pdf-to-docx': ['.pdf'],
    'pdf-to-xlsx': ['.pdf'],
    'pdf-to-json': ['.pdf'],
    'pdf-to-csv': ['.pdf'],
    
    // ==================== NEW CONVERSIONS (43) ====================
    
    // DOCX conversions (4)
    'docx-to-txt': ['.docx', '.doc'],
    'docx-to-html': ['.docx', '.doc'],
    'docx-to-pptx': ['.docx', '.doc'],
    'docx-to-xlsx': ['.docx', '.doc'],
    
    // PPTX conversions (3)
    'pptx-to-txt': ['.pptx', '.ppt'],
    'pptx-to-html': ['.pptx', '.ppt'],
    'pptx-to-md': ['.pptx', '.ppt'],
    
    // TXT conversions (4)
    'txt-to-docx': ['.txt'],
    'txt-to-pdf': ['.txt'],
    'txt-to-html': ['.txt'],
    'txt-to-md': ['.txt'],
    
    // PDF conversions (1)
    'pdf-to-html': ['.pdf'],
    
    // Markdown conversions (4)
    'md-to-pdf': ['.md'],
    'md-to-docx': ['.md'],
    'md-to-odt': ['.md'],
    'md-to-pptx': ['.md'],
    
    // XLSX conversions (4)
    'xlsx-to-json': ['.xlsx', '.xls'],
    'xlsx-to-xml': ['.xlsx', '.xls'],
    'xlsx-to-html': ['.xlsx', '.xls'],
    'xlsx-to-txt': ['.xlsx', '.xls'],
    
    // ODS conversions (3)
    'ods-to-csv': ['.ods'],
    'ods-to-html': ['.ods'],
    'ods-to-txt': ['.ods'],
    
    // ODT conversions (4)
    'odt-to-txt': ['.odt'],
    'odt-to-html': ['.odt'],
    'odt-to-md': ['.odt'],
    'odt-to-pptx': ['.odt'],
    
    // CSV conversions (4)
    'csv-to-xml': ['.csv'],
    'csv-to-html': ['.csv'],
    'csv-to-pdf': ['.csv'],
    'csv-to-txt': ['.csv'],
    
    // JSON conversions (4)
    'json-to-csv': ['.json'],
    'json-to-xlsx': ['.json'],
    'json-to-html': ['.json'],
    'json-to-md': ['.json'],
    
    // XML conversions (4)
    'xml-to-csv': ['.xml'],
    'xml-to-xlsx': ['.xml'],
    'xml-to-html': ['.xml'],
    'xml-to-pdf': ['.xml'],
    
    // HTML conversions (4)
    'html-to-docx': ['.html', '.htm'],
    'html-to-txt': ['.html', '.htm'],
    'html-to-xlsx': ['.html', '.htm'],
    'html-to-csv': ['.html', '.htm']
};

/**
 * Validates if uploaded file matches expected file type for the conversion
 * @param {Object} file - Multer file object
 * @param {string} conversionType - Type of conversion (e.g., 'docx-to-pdf')
 * @throws {AppError} If file type doesn't match expected types
 */
export function validateFileType(file, conversionType) {
    if (!file) {
        throw new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    const allowedExtensions = FILE_TYPE_RULES[conversionType];
    
    if (!allowedExtensions) {
        throw new AppError('Invalid conversion type', HTTP_STATUS.BAD_REQUEST);
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        const expectedTypes = allowedExtensions.join(', ');
        throw new AppError(
            `Invalid file type. Expected ${expectedTypes} but received ${fileExtension || 'unknown'} file. Please upload a ${expectedTypes} file for this conversion.`,
            HTTP_STATUS.BAD_REQUEST
        );
    }
    
    return true;
}

/**
 * Get allowed file extensions for a conversion type
 * @param {string} conversionType - Type of conversion
 * @returns {string[]} Array of allowed extensions
 */
export function getAllowedExtensions(conversionType) {
    return FILE_TYPE_RULES[conversionType] || [];
}
