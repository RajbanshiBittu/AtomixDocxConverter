import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import TurndownService from "turndown";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createJobWorkspace } from "../jobs/jobManager.js";

export const docxToMarkdownEngine = {
    async convert(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Step 1: Convert DOCX to HTML using LibreOffice
        const tempHtmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + ".html");
        
        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "html",
            "--outdir",
            job.workingDir,
            inputPath
        ];

        await executeLibreOffice(args);

        // Verify HTML was created
        try {
            await fs.access(tempHtmlPath);
        } catch (error) {
            throw new Error(`Conversion failed: Could not convert DOCX to HTML. The input file may be corrupted or in an unsupported format.`);
        }

        // Step 2: Convert HTML to Markdown using Turndown
        const htmlContent = await fs.readFile(tempHtmlPath, 'utf-8');
        
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

        // Verify output file exists
        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error(`Conversion failed: Output file not created.`);
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
    });
}
