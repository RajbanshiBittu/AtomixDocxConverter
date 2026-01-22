import path from "path";
import fs from "fs/promises";
import * as cheerio from "cheerio";
import HTMLtoDOCX from 'html-to-docx';
import createJobWorkspace from "../jobs/jobManager.js";
import xlsx from "xlsx";
import logger from "../../utils/logger.js";


export const htmlConversionEngine = {
    /**
     * Convert HTML to DOCX
     * Converts HTML content to Word document
     */
    async convertToDocx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read HTML content
        const htmlContent = await fs.readFile(inputPath, 'utf-8');

        // Convert HTML to DOCX using html-to-docx
        const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
            table: { row: { cantSplit: true } },
            footer: false,
            pageNumber: false,
        });

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".docx";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, docxBuffer);

        try {
            await fs.access(outputPath);
            logger.info(`Converted HTML to DOCX at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert HTML to TXT
     * Extracts text content from HTML
     */
    async convertToTxt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read HTML content
        const htmlContent = await fs.readFile(inputPath, 'utf-8');

        // Extract text using cheerio
        const $ = cheerio.load(htmlContent);
        
        // Remove script and style tags
        $('script, style').remove();
        
        // Get text content
        const textContent = $('body').text().trim() || $.text().trim();
        
        // Clean up whitespace
        const cleanedText = textContent
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".txt";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, cleanedText, 'utf-8');

        try {
            await fs.access(outputPath);
            logger.info(`Converted HTML to TXT at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert HTML to XLSX
     * Extracts tables from HTML and converts to Excel
     */
    async convertToXlsx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read HTML content
        const htmlContent = await fs.readFile(inputPath, 'utf-8');

        // Extract tables using cheerio
        const $ = cheerio.load(htmlContent);
        const workbook = xlsx.utils.book_new();
        const tables = $('table');

        if (tables.length === 0) {
            // No tables found - create a sheet with text content
            const text = $('body').text().trim() || $.text().trim();
            const rows = text.split('\n').filter(line => line.trim()).map(line => [line.trim()]);
            const worksheet = xlsx.utils.aoa_to_sheet(rows);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Content');
        } else {
            // Extract each table as a separate sheet
            tables.each((index, table) => {
                const rows = [];
                $(table).find('tr').each((_, row) => {
                    const cells = [];
                    $(row).find('td, th').each((_, cell) => {
                        cells.push($(cell).text().trim());
                    });
                    if (cells.length > 0) {
                        rows.push(cells);
                    }
                });

                if (rows.length > 0) {
                    const worksheet = xlsx.utils.aoa_to_sheet(rows);
                    const sheetName = `Table_${index + 1}`;
                    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
                }
            });
        }

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".xlsx";
        const outputPath = path.join(job.outputDir, outputFile);

        xlsx.writeFile(workbook, outputPath);

        try {
            await fs.access(outputPath);
            logger.info(`Converted HTML to XLSX at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert HTML to CSV
     * Extracts first table from HTML and converts to CSV
     */
    async convertToCsv(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read HTML content
        const htmlContent = await fs.readFile(inputPath, 'utf-8');

        // Extract tables using cheerio
        const $ = cheerio.load(htmlContent);
        const firstTable = $('table').first();

        let csvContent = '';

        if (firstTable.length > 0) {
            // Extract table as CSV
            const rows = [];
            firstTable.find('tr').each((_, row) => {
                const cells = [];
                $(row).find('td, th').each((_, cell) => {
                    cells.push($(cell).text().trim());
                });
                if (cells.length > 0) {
                    rows.push(cells);
                }
            });

            // Convert to CSV
            csvContent = rows.map(row => 
                row.map(cell => escapeCsvField(cell)).join(',')
            ).join('\n');
        } else {
            // No table found - extract text as single column CSV
            const text = $('body').text().trim() || $.text().trim();
            const lines = text.split('\n').filter(line => line.trim());
            csvContent = lines.map(line => escapeCsvField(line.trim())).join('\n');
        }

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".csv";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, csvContent, 'utf-8');

        try {
            await fs.access(outputPath);
            logger.info(`Converted HTML to CSV at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

function escapeCsvField(field) {
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    
    return str;
}
