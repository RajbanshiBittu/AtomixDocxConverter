import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import createJobWorkspace from "../jobs/jobManager.js";

export const openDocumentEngine = {
    async convert(inputFile, targetFormat) {
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        await fs.rename(inputFile.path, inputPath);

        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            targetFormat,
            "--outdir",
            outputDir,
            inputPath
        ];

        await executeLibreOffice(args);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + "." + targetFormat;
        const outputPath = path.join(outputDir, outputFile);

        // Verify output file exists - LibreOffice may exit with code 0 even on failure
        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error(`Conversion failed: Output file not created. The input file may be corrupted or in an unsupported format.`);
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
