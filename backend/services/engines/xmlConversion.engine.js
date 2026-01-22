import path from "path";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import createJobWorkspace  from "../jobs/jobManager.js";
import xlsx from "xlsx";

export const xmlConversionEngine = {
    /**
     * Convert XML to CSV
     * Parses XML and converts to CSV format
     */
    async convertToCsv(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XML file
        const xmlContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse XML to JSON
        const jsonData = xmlToJson(xmlContent);

        // Convert JSON to CSV
        const csvContent = jsonToCsv(jsonData);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".csv";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, csvContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert XML to XLSX
     * Parses XML and converts to Excel spreadsheet
     */
    async convertToXlsx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XML file
        const xmlContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse XML to JSON
        const jsonData = xmlToJson(xmlContent);
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

        // Create workbook
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(dataArray);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".xlsx";
        const outputPath = path.join(job.outputDir, outputFile);

        xlsx.writeFile(workbook, outputPath);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert XML to HTML
     * Parses XML and converts to HTML table or formatted display
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XML file
        const xmlContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse XML to JSON
        const jsonData = xmlToJson(xmlContent);

        // Convert to HTML
        const htmlContent = xmlToHtml(jsonData, xmlContent);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".html";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, htmlContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert XML to PDF using XSLT-like transformation
     * Converts XML to HTML first, then to PDF using Puppeteer
     */
    async convertToPdf(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XML file
        const xmlContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse XML to JSON
        const jsonData = xmlToJson(xmlContent);

        // Convert to HTML
        const htmlContent = xmlToHtml(jsonData, xmlContent);

        // Use Puppeteer to generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".pdf";
        const outputPath = path.join(job.outputDir, outputFile);

        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
        });

        await browser.close();

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

/**
 * Simple XML to JSON parser
 */
function xmlToJson(xmlString) {
    // Remove XML declaration and comments
    xmlString = xmlString
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();

    const result = [];
    const tagPattern = /<(\w+)[^>]*>([\s\S]*?)<\/\1>/g;
    let match;

    const rootMatch = xmlString.match(/<(\w+)[^>]*>([\s\S]*)<\/\1>/);
    if (!rootMatch) {
        return {};
    }

    const rootContent = rootMatch[2];
    const childTags = new Set();
    
    // Find all unique child tags
    let tempMatch;
    const tempPattern = /<(\w+)[^>]*>/g;
    while ((tempMatch = tempPattern.exec(rootContent)) !== null) {
        childTags.add(tempMatch[1]);
    }

    // Parse each unique tag type
    childTags.forEach(tagName => {
        const tagPattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'g');
        const matches = [...rootContent.matchAll(tagPattern)];
        
        matches.forEach(match => {
            const content = match[1].trim();
            const obj = {};
            
            // Check if content has nested tags
            if (content.includes('<')) {
                const nestedPattern = /<(\w+)[^>]*>([\s\S]*?)<\/\1>/g;
                let nestedMatch;
                while ((nestedMatch = nestedPattern.exec(content)) !== null) {
                    obj[nestedMatch[1]] = nestedMatch[2].trim();
                }
            } else {
                // Simple text content - use tag name as key
                obj[tagName] = content;
            }
            
            if (Object.keys(obj).length > 0) {
                result.push(obj);
            }
        });
    });

    return result.length > 0 ? result : {};
}

/**
 * Convert JSON to CSV
 */
function jsonToCsv(jsonData) {
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    if (dataArray.length === 0) {
        return '';
    }

    // Get all unique keys
    const keys = new Set();
    dataArray.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach(key => keys.add(key));
        }
    });

    const headers = Array.from(keys);
    
    // Build CSV
    let csv = headers.map(h => escapeCsvField(h)).join(',') + '\n';
    
    dataArray.forEach(obj => {
        const row = headers.map(key => {
            const value = obj[key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return escapeCsvField(JSON.stringify(value));
            return escapeCsvField(String(value));
        });
        csv += row.join(',') + '\n';
    });

    return csv;
}

function escapeCsvField(field) {
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

/**
 * Convert XML to HTML
 */
function xmlToHtml(jsonData, originalXml) {
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    let content = '';

    if (dataArray.length > 0 && typeof dataArray[0] === 'object') {
        // Create table for parsed data
        const keys = Object.keys(dataArray[0]);
        
        content += '<table>\n  <thead>\n    <tr>\n';
        keys.forEach(key => {
            content += `      <th>${escapeHtml(key)}</th>\n`;
        });
        content += '    </tr>\n  </thead>\n  <tbody>\n';

        dataArray.forEach(obj => {
            content += '    <tr>\n';
            keys.forEach(key => {
                const value = obj[key];
                const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
                content += `      <td>${escapeHtml(displayValue)}</td>\n`;
            });
            content += '    </tr>\n';
        });

        content += '  </tbody>\n</table>';

        // Also show original XML
        content += '\n<h2>Original XML</h2>\n';
        content += `<pre><code>${escapeHtml(originalXml)}</code></pre>`;
    } else {
        // Show original XML
        content += `<pre><code>${escapeHtml(originalXml)}</code></pre>`;
    }

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from XML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #ddd;
        }
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', monospace;
        }
        h2 {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <h1>XML Data</h1>
    ${content}
</body>
</html>`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
