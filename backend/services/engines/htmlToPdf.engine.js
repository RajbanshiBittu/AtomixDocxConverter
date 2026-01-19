import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";
import { createJobWorkspace } from "../jobs/jobManager.js";

export const htmlToPdfEngine = {
    async convert(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const htmlContent = await fs.readFile(inputPath, 'utf-8');

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".pdf";
        const outputPath = path.join(job.outputDir, outputFile);

        // Launch headless browser and convert HTML to PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });

            // Verify output file exists
            try {
                await fs.access(outputPath);
            } catch (error) {
                throw new Error(`Conversion failed: Output file not created. The HTML content may be invalid or unsupported.`);
            }

            return { outputPath };
        } finally {
            await browser.close();
        }
    }
};
