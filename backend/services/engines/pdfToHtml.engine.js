import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createJobWorkspace } from "../jobs/jobManager.js";

export const pdfToHtmlEngine = {
    /**
     * Convert PDF to HTML using LibreOffice
     * Note: Works best with text-based PDFs. Scanned PDFs may produce limited output.
     */
    async convert(inputFile) {
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
            throw new Error('Conversion failed: Output file not created. The PDF may be scanned or in an unsupported format.');
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
