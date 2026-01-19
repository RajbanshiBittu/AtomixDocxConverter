import path from "path";
import fs from "fs/promises";
import { createJobWorkspace } from "../jobs/jobManager.js";
import xlsx from "xlsx";
import * as cheerio from "cheerio";

export const xlsxConversionEngine = {
    /**
     * Convert XLSX to JSON
     * Exports spreadsheet data as JSON array of objects
     */
    async convertToJson(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XLSX file
        const workbook = xlsx.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".json";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert XLSX to XML
     * Exports spreadsheet data as XML format
     */
    async convertToXml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XLSX file
        const workbook = xlsx.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON first
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

        // Convert JSON to XML
        const xmlContent = jsonToXml(jsonData);

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
     * Convert XLSX to HTML
     * Exports spreadsheet as HTML table
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XLSX file
        const workbook = xlsx.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to HTML
        const htmlTable = xlsx.utils.sheet_to_html(worksheet);

        // Wrap in proper HTML document
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from XLSX</title>
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
    <h1>Spreadsheet Data</h1>
    ${htmlTable}
</body>
</html>`;

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
     * Convert XLSX to TXT
     * Exports spreadsheet data as plain text
     */
    async convertToTxt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read XLSX file
        const workbook = xlsx.readFile(inputPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Get range of cells
        const range = xlsx.utils.decode_range(worksheet['!ref']);
        let textContent = '';

        // Convert each row to text
        for (let row = range.s.r; row <= range.e.r; row++) {
            const rowValues = [];
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
                const cell = worksheet[cellAddress];
                rowValues.push(cell ? String(cell.v) : '');
            }
            textContent += rowValues.join('\t') + '\n';
        }

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".txt";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, textContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

/**
 * Helper function to convert JSON array to XML
 */
function jsonToXml(data) {
    function escapeXml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<spreadsheet>\n';

    if (Array.isArray(data)) {
        data.forEach(row => {
            xml += '  <row>\n';
            Object.keys(row).forEach(key => {
                const value = row[key];
                xml += `    <${key}>${escapeXml(value)}</${key}>\n`;
            });
            xml += '  </row>\n';
        });
    }

    xml += '</spreadsheet>';
    return xml;
}
