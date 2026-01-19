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
    'pdf-to-csv': ['.pdf']
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
