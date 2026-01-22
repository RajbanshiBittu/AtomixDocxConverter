import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import  createJobWorkspace  from "../jobs/jobManager.js";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import HTMLtoDOCX from 'html-to-docx';
import logger from "../../utils/logger.js";

export const pdfToDocxEngine = {
    async convert(inputFile, mode = 'fast') {
        const startTime = Date.now();
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        // Move uploaded file to working directory
        await fs.rename(inputFile.path, inputPath);

        try {
            // Step 1: Convert PDF to HTML using LibreOffice
            logger.info('Converting PDF to HTML via LibreOffice...');
            await this.convertPdfToHtml(inputPath, job.workingDir);

            // Step 2: Read and sanitize HTML
            const baseName = path.parse(inputFile.originalname).name;
            const htmlPath = path.join(job.workingDir, baseName + '.html');
            
            let htmlContent = '';
            try {
                await fs.access(htmlPath);
                htmlContent = await fs.readFile(htmlPath, 'utf-8');
                logger.info('HTML file read successfully, size:', htmlContent.length);
            } catch (htmlError) {
                throw new Error('HTML conversion failed: Output HTML not created');
            }

            // Step 3: Sanitize HTML (remove scripts, styles, ensure proper structure)
            htmlContent = this.sanitizeHtml(htmlContent);

            // Step 4: Convert HTML to DOCX using html-to-docx
            logger.info('Converting HTML to DOCX...');
            const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
                table: { row: { cantSplit: true } },
                footer: true,
                pageNumber: true,
            });
            // console.log('DOCX buffer created, size:', docxBuffer.length);

            // Step 5: Write DOCX file
            const outputFileName = baseName + '.docx';
            const outputPath = path.join(outputDir, outputFileName);
            await fs.writeFile(outputPath, docxBuffer);

            const endTime = Date.now();
            // console.log('PDF to DOCX conversion completed successfully');

            // Create manifest
            const manifest = {
                jobId: job.jobId,
                conversion: 'pdf-to-docx',
                input: {
                    filename: inputFile.originalname,
                    size: inputFile.size
                },
                output: {
                    filename: outputFileName,
                    size: docxBuffer.length
                },
                processing: {
                    method: 'libreoffice-html+html-to-docx',
                    mode: mode,
                    ocrUsed: false,
                    fidelity: 'medium',
                    note: 'Converted via LibreOffice HTML intermediate. Preserves text and basic structure. Complex layouts may differ from original.',
                    duration: endTime - startTime,
                    timestamp: new Date().toISOString()
                },
                tools: {
                    node: process.version,
                    libreoffice: libreOfficeConfig.binary,
                    htmlToDocx: 'html-to-docx'
                }
            };

            // Cleanup working directory
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
            } catch (cleanupError) {
                // console.warn('Cleanup warning:', cleanupError);
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
                // console.warn('Cleanup error:', cleanupError);
                logger.warn('Cleanup error:', cleanupError);
            }
            throw new Error(`PDF to DOCX conversion failed: ${error.message}`);
        }
    },

    sanitizeHtml(htmlContent) {
        // Remove script and style tags
        htmlContent = htmlContent
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

        // Ensure proper HTML structure
        if (!htmlContent.includes('<html')) {
            htmlContent = `<html><body>${htmlContent}</body></html>`;
        }
        if (!htmlContent.includes('<body')) {
            htmlContent = htmlContent.replace('<html>', '<html><body>').replace('</html>', '</body></html>');
        }

        return htmlContent;
    },

    convertPdfToHtml(inputPath, outputDir) {
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

            process.on("error", err => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }
};
