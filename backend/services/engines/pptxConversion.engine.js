import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import TurndownService from "turndown";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createJobWorkspace } from "../jobs/jobManager.js";

export const pptxConversionEngine = {
    /**
     * Convert PPTX to TXT using LibreOffice
     * Extracts text content from all slides
     */
    async convertToTxt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // PPTX to TXT: Use HTML as intermediate format
        // Step 1: Convert PPTX to HTML
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
        } catch (error) {
            throw new Error('Conversion failed: Could not convert PPTX to HTML');
        }

        // Step 2: Convert HTML to TXT (extract text content)
        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "txt",
            "--outdir",
            job.outputDir,
            htmlPath
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
     * Convert PPTX to HTML using LibreOffice
     * Converts presentation slides to HTML format
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
     * Convert PPTX to Markdown using LibreOffice + Turndown
     * Converts presentation to HTML first, then to Markdown
     */
    async convertToMarkdown(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Step 1: Convert PPTX to HTML using LibreOffice
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
            throw new Error('Conversion failed: Could not convert PPTX to HTML');
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
