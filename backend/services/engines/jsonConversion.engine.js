import path from "path";
import fs from "fs/promises";
import createJobWorkspace from "../jobs/jobManager.js";
import xlsx from "xlsx";
import logger from "../../utils/logger.js";

export const jsonConversionEngine = {
    /**
     * Convert JSON to CSV
     * Converts JSON array to CSV format
     */
    async convertToCsv(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read JSON file
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        // Convert to CSV
        const csvContent = jsonToCsv(jsonData);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".csv";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, csvContent, 'utf-8');

        try {
            await fs.access(outputPath);
            logger.info(`Converted JSON to CSV at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert JSON to XLSX
     * Converts JSON array to Excel spreadsheet
     */
    async convertToXlsx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read JSON file
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        // Ensure it's an array
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
            logger.info(`Converted JSON to XLSX at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert JSON to HTML
     * Converts JSON to formatted HTML with table or nested structure
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read JSON file
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        // Convert to HTML
        const htmlContent = jsonToHtml(jsonData);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".html";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, htmlContent, 'utf-8');

        try {
            await fs.access(outputPath);
            logger.info(`Converted JSON to HTML at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert JSON to Markdown
     * Converts JSON to formatted Markdown
     */
    async convertToMarkdown(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read JSON file
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        // Convert to Markdown
        const markdownContent = jsonToMarkdown(jsonData);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".md";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, markdownContent, 'utf-8');

        try {
            await fs.access(outputPath);
            logger.info(`Converted JSON to Markdown at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

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
 * Convert JSON to HTML
 */
function jsonToHtml(jsonData) {
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    let content = '';

    if (dataArray.length > 0 && typeof dataArray[0] === 'object') {
        // Create table for array of objects
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
    } else {
        // Show as formatted JSON
        content += `<pre><code>${escapeHtml(JSON.stringify(jsonData, null, 2))}</code></pre>`;
    }

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from JSON</title>
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
    </style>
</head>
<body>
    <h1>JSON Data</h1>
    ${content}
</body>
</html>`;
}

/**
 * Convert JSON to Markdown
 */
function jsonToMarkdown(jsonData) {
    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    let markdown = '# JSON Data\n\n';

    if (dataArray.length > 0 && typeof dataArray[0] === 'object') {
        // Create table for array of objects
        const keys = Object.keys(dataArray[0]);
        
        // Header
        markdown += '| ' + keys.join(' | ') + ' |\n';
        markdown += '| ' + keys.map(() => '---').join(' | ') + ' |\n';

        // Rows
        dataArray.forEach(obj => {
            const row = keys.map(key => {
                const value = obj[key];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value).replace(/\|/g, '\\|');
            });
            markdown += '| ' + row.join(' | ') + ' |\n';
        });
    } else {
        // Show as formatted JSON code block
        markdown += '```json\n' + JSON.stringify(jsonData, null, 2) + '\n```\n';
    }

    return markdown;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
