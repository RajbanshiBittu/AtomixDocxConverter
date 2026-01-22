import path from "path";
import fs from "fs/promises";
import  createJobWorkspace  from "../jobs/jobManager.js";
import puppeteer from "puppeteer";
import HTMLtoDOCX from 'html-to-docx';

export const txtConversionEngine = {
    /**
     * Convert TXT to DOCX
     * Creates a formatted Word document from plain text
     */
    async convertToDocx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read text content
        const textContent = await fs.readFile(inputPath, 'utf-8');

        // Convert text to HTML (preserve line breaks and formatting)
        const htmlContent = textToHtml(textContent);

        // Convert HTML to DOCX using html-to-docx
        const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
            table: { row: { cantSplit: true } },
            footer: false,
            pageNumber: false,
        });

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".docx";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, docxBuffer);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert TXT to PDF using Puppeteer
     * Renders text as HTML and generates PDF
     */
    async convertToPdf(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read text content
        const textContent = await fs.readFile(inputPath, 'utf-8');

        // Convert text to HTML
        const htmlContent = textToHtml(textContent);

        // Use Puppeteer to generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".pdf";
        const outputPath = path.join(job.outputDir, outputFile);

        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
        });

        await browser.close();

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert TXT to HTML
     * Wraps text in proper HTML structure
     */
    async convertToHtml(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read text content
        const textContent = await fs.readFile(inputPath, 'utf-8');

        // Convert text to HTML
        const htmlContent = textToHtml(textContent);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".html";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, htmlContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert TXT to Markdown
     * Wraps text in markdown code blocks or preserves as plain text
     */
    async convertToMarkdown(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read text content
        const textContent = await fs.readFile(inputPath, 'utf-8');

        // Text is already in markdown-compatible format (plain text)
        // Just preserve it as-is
        const markdownContent = textContent;

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".md";
        const outputPath = path.join(job.outputDir, outputFile);

        await fs.writeFile(outputPath, markdownContent, 'utf-8');

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    }
};

/**
 * Helper function to convert plain text to HTML
 */
function textToHtml(text) {
    // Escape HTML special characters
    const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // Convert line breaks to <br> and paragraphs
    const paragraphs = escapedText.split('\n\n').filter(p => p.trim());
    
    const htmlParagraphs = paragraphs.map(para => {
        const lines = para.split('\n').join('<br>');
        return `<p>${lines}</p>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from Text</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        p {
            margin: 1em 0;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
${htmlParagraphs}
</body>
</html>`;
}
