import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import createJobWorkspace from "../jobs/jobManager.js";
import xlsx from "xlsx";
import * as cheerio from "cheerio";
import { minimalPptxGenerator } from "./minimalPptx.generator.js";
import logger from "../../utils/logger.js";

export const docxConversionEngine = {
    /**
     * Convert DOCX to TXT using LibreOffice
     */
    async convertToTxt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "txt",
            "--outdir",
            job.outputDir,
            inputPath
        ];

        await executeLibreOffice(args);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".txt";
        const outputPath = path.join(job.outputDir, outputFile);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert DOCX to HTML using LibreOffice
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "html",
            "--outdir",
            job.outputDir,
            inputPath
        ];

        await executeLibreOffice(args);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".html";
        const outputPath = path.join(job.outputDir, outputFile);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert DOCX to PPTX using text extraction and minimal PPTX generation
     * Creates a presentation with extracted text content
     */
    async convertToPptx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Step 1: Convert DOCX to TXT to extract content
        const txtPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + ".txt");
        
        const txtArgs = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "txt",
            "--outdir",
            job.workingDir,
            inputPath
        ];

        await executeLibreOffice(txtArgs);

        try {
            await fs.access(txtPath);
            logger.info(`Extracted text from DOCX to ${txtPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Could not extract text from DOCX');
        }

        // Step 2: Read extracted text
        const textContent = await fs.readFile(txtPath, 'utf-8');

        // Step 3: Generate minimal PPTX from text
        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".pptx";
        const outputPath = path.join(job.outputDir, outputFile);

        await minimalPptxGenerator.createFromText(
            textContent,
            parsed.name,
            outputPath
        );

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert DOCX to XLSX - extracts tables from document
     * Tables in DOCX are converted to Excel spreadsheet
     */
    async convertToXlsx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // First convert DOCX to HTML to extract tables
        const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + ".html");
        
        const htmlArgs = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "html",
            "--outdir",
            job.workingDir,
            inputPath
        ];

        await executeLibreOffice(htmlArgs);

        try {
            await fs.access(htmlPath);
            logger.info(`Converted DOCX to HTML at ${htmlPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Could not convert DOCX to HTML');
        }

        // Read HTML and extract tables
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');
        const $ = cheerio.load(htmlContent);
        
        const workbook = xlsx.utils.book_new();
        const tables = $('table');

        if (tables.length === 0) {
            // No tables found - create a single sheet with text content
            const text = $.text().trim();
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
            logger.info(`Converted DOCX to XLSX at ${outputPath}`);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

function executeLibreOffice(args) {
    return new Promise((resolve, reject) => {
        const process = spawn(libreOfficeConfig.binary, args);

        const timer = setTimeout(() => {
            process.kill("SIGKILL");
            reject(new Error("LibreOffice conversion timeout"));
        }, libreOfficeConfig.timeoutMs);

        process.on("exit", code => {
            clearTimeout(timer);
            code === 0 ? resolve() : reject(new Error("LibreOffice conversion failed"));
        });

        process.on("error", err => {
            clearTimeout(timer);
            reject(err);
        });
    });
}
