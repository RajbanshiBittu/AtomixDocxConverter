import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import TurndownService from "turndown";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createJobWorkspace } from "../jobs/jobManager.js";
import { minimalPptxGenerator } from "./minimalPptx.generator.js";

export const odtConversionEngine = {
    /**
     * Convert ODT to TXT using LibreOffice
     * Extracts plain text from document
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
     * Convert ODT to HTML using LibreOffice
     * Converts document to HTML format
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
     * Convert ODT to Markdown using LibreOffice + Turndown
     * Converts document to HTML first, then to Markdown
     */
    async convertToMarkdown(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Step 1: Convert ODT to HTML using LibreOffice
        const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + ".html");
        
        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "html",
            "--outdir",
            job.workingDir,
            inputPath
        ];

        await executeLibreOffice(args);

        try {
            await fs.access(htmlPath);
        } catch (error) {
            throw new Error('Conversion failed: Could not convert ODT to HTML');
        }

        // Step 2: Convert HTML to Markdown using Turndown
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');
        
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            bulletListMarker: '-'
        });

        const markdown = turndownService.turndown(htmlContent);

        // Step 3: Write markdown output
        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".md";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, markdown, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert ODT to PPTX using text extraction and minimal PPTX generation
     * Creates a presentation with extracted text content
     */
    async convertToPptx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Step 1: Convert ODT to TXT to extract content
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
        } catch (error) {
            throw new Error('Conversion failed: Could not extract text from ODT');
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
