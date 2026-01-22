import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import createJobWorkspace from "../jobs/jobManager.js";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import { createRequire } from 'module';
import logger from "../../utils/logger.js";

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule;

export const pdfToTextEngine = {
    async convert(inputFile, mode = 'fast') {
        const startTime = Date.now();
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        // Move uploaded file to working directory
        await fs.rename(inputFile.path, inputPath);

        let extractedText = '';
        let ocrUsed = false;
        let method = 'pdf-parse';

        try {
            // Mode 1: Try fast text extraction first
            if (mode === 'fast' || mode === 'structured') {
                try {
                    const dataBuffer = await fs.readFile(inputPath);
                    const parser = new pdfParse({ data: dataBuffer });
                    const data = await parser.getText();
                    extractedText = data.text;
                    
                    if (extractedText.trim().length > 50) {
                        method = 'pdf-parse';
                    } else {
                        throw new Error('Insufficient text extracted');
                    }
                } catch (parseError) {
                    logger.info('PDF-parse failed, trying LibreOffice method:', parseError.message);
                }
            }

            // Mode 2: If fast extraction failed, use LibreOffice conversion
            if (!extractedText || extractedText.trim().length < 50) {
                // Convert PDF to HTML using LibreOffice
                const htmlFile = path.join(job.workingDir, 'temp.html');
                await this.convertPdfToHtml(inputPath, job.workingDir);
                
                // Read the HTML file and extract text
                const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + '.html');
                
                try {
                    await fs.access(htmlPath);
                    const htmlContent = await fs.readFile(htmlPath, 'utf-8');
                    // Simple HTML tag removal
                    extractedText = htmlContent
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    method = 'libreoffice-html';
                } catch (htmlError) {
                    logger.error('HTML conversion failed:', htmlError);
                }
            }

            // Mode 3: OCR fallback (placeholder - requires tesseract.js)
            if (mode === 'ocr' && (!extractedText || extractedText.trim().length < 50)) {
                ocrUsed = true;
                method = 'ocr-placeholder';
                extractedText = '// OCR mode requires tesseract.js installation\n' +
                               '// Install: npm install tesseract.js\n' +
                               '// This is a placeholder for OCR functionality';
            }

            if (!extractedText || extractedText.trim().length === 0) {
                throw new Error('Unable to extract text from PDF. The file may be scanned or corrupted.');
            }

            // Write output text file
            const outputFileName = path.parse(inputFile.originalname).name + '.txt';
            const outputPath = path.join(outputDir, outputFileName);
            await fs.writeFile(outputPath, extractedText, 'utf-8');

            const endTime = Date.now();

            // Create manifest
            const manifest = {
                jobId: job.jobId,
                conversion: 'pdf-to-text',
                input: {
                    filename: inputFile.originalname,
                    size: inputFile.size
                },
                output: {
                    filename: outputFileName,
                    size: Buffer.byteLength(extractedText, 'utf-8')
                },
                processing: {
                    method: method,
                    mode: mode,
                    ocrUsed: ocrUsed,
                    duration: endTime - startTime,
                    timestamp: new Date().toISOString()
                },
                tools: {
                    node: process.version,
                    pdfParse: 'latest',
                    libreoffice: libreOfficeConfig.binary
                }
            };

            // Cleanup working directory
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
            } catch (cleanupError) {
                logger.warn('Cleanup warning:', cleanupError);
            }

            return {
                outputPath,
                outputDir,
                manifest
            };

        } catch (error) {
            // Cleanup on error
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
                await fs.rm(outputDir, { recursive: true, force: true });
            } catch (cleanupError) {
                logger.warn('Cleanup error:', cleanupError);
            }
            throw new Error(`PDF to text conversion failed: ${error.message}`);
        }
    },

    async convertPdfToHtml(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            const args = [
                ...libreOfficeConfig.baseArgs,
                "--convert-to",
                "html",
                "--outdir",
                outputDir,
                inputPath
            ];

            const process = spawn(libreOfficeConfig.binary, args);

            const timer = setTimeout(() => {
                process.kill("SIGKILL");
                reject(new Error("LibreOffice conversion timeout"));
            }, libreOfficeConfig.timeoutMs);

            process.on("exit", code => {
                clearTimeout(timer);
                code === 0 ? resolve() : reject(new Error(`LibreOffice failed with code ${code}`));
            });
        });
    }
};
