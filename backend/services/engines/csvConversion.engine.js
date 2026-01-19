import path from "path";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import { createJobWorkspace } from "../jobs/jobManager.js";
import xlsx from "xlsx";

export const csvConversionEngine = {
    /**
     * Convert CSV to XML
     * Converts CSV data to XML format
     */
    async convertToXml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read CSV file
        const csvContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse CSV
        const rows = parseCsv(csvContent);
        
        // Convert to XML
        const xmlContent = csvToXml(rows);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".xml";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, xmlContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert CSV to HTML
     * Converts CSV data to HTML table
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read CSV file
        const csvContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse CSV
        const rows = parseCsv(csvContent);
        
        // Convert to HTML
        const htmlContent = csvToHtml(rows);

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
     * Convert CSV to PDF
     * Converts CSV to HTML table first, then to PDF using Puppeteer
     */
    async convertToPdf(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read CSV file
        const csvContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse CSV
        const rows = parseCsv(csvContent);
        
        // Convert to HTML
        const htmlContent = csvToHtml(rows);

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
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            landscape: true // Better for tables
        });

        await browser.close();

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert CSV to TXT
     * Converts CSV to tab-separated or space-formatted text
     */
    async convertToTxt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read CSV file
        const csvContent = await fs.readFile(inputPath, 'utf-8');
        
        // Parse CSV and convert to tab-separated text
        const rows = parseCsv(csvContent);
        const txtContent = rows.map(row => row.join('\t')).join('\n');

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".txt";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, txtContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

/**
 * Parse CSV content into array of arrays
 */
function parseCsv(csvContent) {
    const rows = [];
    const lines = csvContent.split('\n');
    
    for (const line of lines) {
        if (line.trim()) {
            // Simple CSV parsing (handles quoted fields)
            const row = [];
            let currentField = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];
                
                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        currentField += '"';
                        i++; // Skip next quote
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    row.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            row.push(currentField.trim());
            rows.push(row);
        }
    }
    
    return rows;
}

/**
 * Convert CSV rows to XML
 */
function csvToXml(rows) {
    function escapeXml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';

    if (rows.length > 0) {
        const headers = rows[0];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            xml += '  <row>\n';
            
            for (let j = 0; j < headers.length; j++) {
                const header = headers[j].replace(/[^a-zA-Z0-9]/g, '_');
                const value = row[j] || '';
                xml += `    <${header}>${escapeXml(value)}</${header}>\n`;
            }
            
            xml += '  </row>\n';
        }
    }

    xml += '</data>';
    return xml;
}

/**
 * Convert CSV rows to HTML table
 */
function csvToHtml(rows) {
    let tableHtml = '<table>\n';

    if (rows.length > 0) {
        // Header row
        tableHtml += '  <thead>\n    <tr>\n';
        rows[0].forEach(cell => {
            tableHtml += `      <th>${escapeHtml(cell)}</th>\n`;
        });
        tableHtml += '    </tr>\n  </thead>\n';

        // Data rows
        tableHtml += '  <tbody>\n';
        for (let i = 1; i < rows.length; i++) {
            tableHtml += '    <tr>\n';
            rows[i].forEach(cell => {
                tableHtml += `      <td>${escapeHtml(cell)}</td>\n`;
            });
            tableHtml += '    </tr>\n';
        }
        tableHtml += '  </tbody>\n';
    }

    tableHtml += '</table>';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from CSV</title>
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
    </style>
</head>
<body>
    <h1>CSV Data</h1>
    ${tableHtml}
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
