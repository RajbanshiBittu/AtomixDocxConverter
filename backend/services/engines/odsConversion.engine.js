import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createJobWorkspace } from "../jobs/jobManager.js";
import * as cheerio from "cheerio";
import xlsx from "xlsx";

export const odsConversionEngine = {
    /**
     * Convert ODS to CSV using LibreOffice
     * Exports first sheet as CSV
     */
    async convertToCsv(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "csv",
            "--outdir",
            job.outputDir,
            inputPath
        ];

        await executeLibreOffice(args);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".csv";
        const outputPath = path.join(job.outputDir, outputFile);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert ODS to HTML using LibreOffice
     * Exports spreadsheet as HTML table
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
     * Convert ODS to TXT using LibreOffice
     * Exports spreadsheet data as plain text
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
