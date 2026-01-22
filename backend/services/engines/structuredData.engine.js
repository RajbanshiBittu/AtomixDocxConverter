import path from "path";
import fs from "fs/promises";
import createJobWorkspace from "../jobs/jobManager.js";
import xlsx from "xlsx";
import { Logger } from "winston";



export const structuredDataEngine = {
    async convert(inputFile, sourceFormat, targetFormat) {
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + "." + targetFormat;
        const outputPath = path.join(job.outputDir, outputFile);

        // Binary format conversions (XLSX)
        if (targetFormat === 'xlsx' || sourceFormat === 'xlsx') {
            await convertWithXlsx(inputPath, outputPath, sourceFormat, targetFormat);
            return { outputPath };
        }

        // Text-based conversions
        const inputContent = await fs.readFile(inputPath, 'utf-8');
        let outputContent;

        // Conversion logic
        if (sourceFormat === 'json' && targetFormat === 'xml') {
            outputContent = jsonToXml(inputContent);
        } else if (sourceFormat === 'xml' && targetFormat === 'json') {
            outputContent = xmlToJson(inputContent);
        } else if (sourceFormat === 'json' && targetFormat === 'csv') {
            outputContent = jsonToCsv(inputContent);
        } else if (sourceFormat === 'csv' && targetFormat === 'json') {
            outputContent = csvToJson(inputContent);
        } else if (sourceFormat === 'xml' && targetFormat === 'csv') {
            outputContent = xmlToCsv(inputContent);
        } else if (sourceFormat === 'csv' && targetFormat === 'xml') {
            outputContent = csvToXml(inputContent);
        } else {
            throw new Error(`Unsupported conversion: ${sourceFormat} to ${targetFormat}`);
        }

        await fs.writeFile(outputPath, outputContent, 'utf-8');

        return { outputPath };
    }
};

// XLSX conversions using xlsx library
async function convertWithXlsx(inputPath, outputPath, sourceFormat, targetFormat) {
    if (sourceFormat === 'xlsx' && targetFormat === 'csv') {
        // XLSX to CSV
        const workbook = xlsx.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csv = xlsx.utils.sheet_to_csv(worksheet);
        await fs.writeFile(outputPath, csv, 'utf-8');
    } else if (sourceFormat === 'csv' && targetFormat === 'xlsx') {
        // CSV to XLSX
        const csvContent = await fs.readFile(inputPath, 'utf-8');
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet(csvContent.split('\n').map(line => parseCsvLine(line)));
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        xlsx.writeFile(workbook, outputPath);
    } else if (sourceFormat === 'json' && targetFormat === 'xlsx') {
        // JSON to XLSX
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const data = JSON.parse(jsonContent);
        const array = Array.isArray(data) ? data : [data];
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(array);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        xlsx.writeFile(workbook, outputPath);
    } else {
        throw new Error(`Unsupported XLSX conversion: ${sourceFormat} to ${targetFormat}`);
    }
}

// JSON to XML conversion
function jsonToXml(jsonString) {
    const data = JSON.parse(jsonString);
    
    function objectToXml(obj, rootName = 'root') {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
        
        function processValue(key, value, indent = '  ') {
            if (value === null || value === undefined) {
                return `${indent}<${key}/>\n`;
            } else if (Array.isArray(value)) {
                let result = '';
                value.forEach(item => {
                    result += `${indent}<${key}>\n`;
                    if (typeof item === 'object' && item !== null) {
                        Object.keys(item).forEach(k => {
                            result += processValue(k, item[k], indent + '  ');
                        });
                    } else {
                        result += `${indent}  ${escapeXml(String(item))}\n`;
                    }
                    result += `${indent}</${key}>\n`;
                });
                return result;
            } else if (typeof value === 'object') {
                let result = `${indent}<${key}>\n`;
                Object.keys(value).forEach(k => {
                    result += processValue(k, value[k], indent + '  ');
                });
                result += `${indent}</${key}>\n`;
                return result;
            } else {
                return `${indent}<${key}>${escapeXml(String(value))}</${key}>\n`;
            }
        }
        
        if (Array.isArray(data)) {
            data.forEach(item => {
                xml += processValue('item', item);
            });
        } else {
            Object.keys(data).forEach(key => {
                xml += processValue(key, data[key]);
            });
        }
        
        xml += `</${rootName}>`;
        return xml;
    }
    
    return objectToXml(data);
}

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// XML to JSON conversion
function xmlToJson(xmlString) {
    const parseXml = (xml) => {
        xml = xml.trim();
        
        // Remove XML declaration
        xml = xml.replace(/<\?xml[^?]*\?>/g, '');
        
        const result = {};
        
        // Simple XML parser
        const tagPattern = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>/gs;
        let match;
        
        while ((match = tagPattern.exec(xml)) !== null) {
            const tagName = match[1] || match[4];
            const content = match[3] || '';
            
            if (content.includes('<')) {
                result[tagName] = parseXml(content);
            } else {
                result[tagName] = unescapeXml(content.trim());
            }
        }
        
        return result;
    };
    
    const parsed = parseXml(xmlString);
    return JSON.stringify(parsed, null, 2);
}

function unescapeXml(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}

// JSON to CSV conversion
function jsonToCsv(jsonString) {
    const data = JSON.parse(jsonString);
    const array = Array.isArray(data) ? data : [data];
    
    if (array.length === 0) return '';
    
    // Get all unique keys
    const keys = [...new Set(array.flatMap(obj => Object.keys(obj)))];
    
    // Create header
    const csv = [keys.join(',')];
    
    // Create rows
    array.forEach(obj => {
        const row = keys.map(key => {
            const value = obj[key];
            if (value === null || value === undefined) return '';
            const str = String(value);
            // Escape commas and quotes
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        });
        csv.push(row.join(','));
    });
    
    return csv.join('\n');
}

// CSV to JSON conversion
function csvToJson(csvString) {
    const lines = csvString.split('\n').filter(line => line.trim());
    if (lines.length === 0) return JSON.stringify([]);
    
    const headers = parseCsvLine(lines[0]);
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        result.push(obj);
    }
    
    return JSON.stringify(result, null, 2);
}

function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

// XML to CSV conversion (via JSON intermediate)
function xmlToCsv(xmlString) {
    const jsonString = xmlToJson(xmlString);
    return jsonToCsv(jsonString);
}

// CSV to XML conversion (via JSON intermediate)
function csvToXml(csvString) {
    const jsonString = csvToJson(csvString);
    return jsonToXml(jsonString);
}
