import path from "path";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import HTMLtoDOCX from 'html-to-docx';
import { spawn } from "child_process";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import createJobWorkspace from "../jobs/jobManager.js";
import { minimalPptxGenerator } from "./minimalPptx.generator.js";

export const markdownConversionEngine = {
    /**
     * Convert Markdown to PDF using Puppeteer
     * Renders markdown as HTML and generates PDF
     */
    async convertToPdf(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read markdown content
        const markdownContent = await fs.readFile(inputPath, 'utf-8');

        // Convert markdown to HTML
        const htmlContent = markdownToHtml(markdownContent);

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
     * Convert Markdown to DOCX
     * Converts markdown to HTML first, then to DOCX
     */
    async convertToDocx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read markdown content
        const markdownContent = await fs.readFile(inputPath, 'utf-8');

        // Convert markdown to HTML
        const htmlContent = markdownToHtml(markdownContent);

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
     * Convert Markdown to ODT
     * Converts markdown to HTML first, then to ODT using LibreOffice
     */
    async convertToOdt(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read markdown content
        const markdownContent = await fs.readFile(inputPath, 'utf-8');

        // Convert markdown to HTML
        const htmlContent = markdownToHtml(markdownContent);

        // Write HTML to temp file
        const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + ".html");
        await fs.writeFile(htmlPath, htmlContent, 'utf-8');

        // Convert HTML to ODT using LibreOffice
        const args = [
            ...libreOfficeConfig.baseArgs,
            "--convert-to",
            "odt",
            "--outdir",
            job.outputDir,
            htmlPath
        ];

        await executeLibreOffice(args);

        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + ".odt";
        const outputPath = path.join(job.outputDir, outputFile);

        try {
            await fs.access(outputPath);
        } catch (error) {
            throw new Error('Conversion failed: Output file not created');
        }

        return { outputPath };
    },

    /**
     * Convert Markdown to PPTX
     * Extracts text content and generates a minimal PPTX presentation
     */
    async convertToPptx(inputFile) {
        const job = await createJobWorkspace(inputFile.originalname);
        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        // Read markdown content
        const markdownContent = await fs.readFile(inputPath, 'utf-8');

        // Extract plain text from markdown (remove markdown syntax)
        const textContent = markdownContent
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1') // Remove inline code markers
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
            .replace(/__([^_]+)__/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1') // Remove italic markers
            .replace(/_([^_]+)_/g, '$1')
            .replace(/#+\s+/g, '') // Remove header markers
            .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove link syntax, keep text
            .replace(/^>\s+/gm, '') // Remove blockquote markers
            .replace(/^[-*+]\s+/gm, '') // Remove list markers
            .trim();

        // Generate minimal PPTX from text
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

/**
 * Convert Markdown to HTML
 */
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Code blocks (must be before inline code)
    html = html.replace(/```([^\n]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Headers
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    
    // Bold (must be before italic)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Horizontal rules
    html = html.replace(/^([-*_]){3,}$/gm, '<hr />');
    
    // Unordered lists
    html = html.replace(/^[\s]*[-*+]\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Ordered lists
    html = html.replace(/^[\s]*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    
    // Blockquotes
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
    
    // Paragraphs (convert double newlines to paragraph breaks)
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs and line breaks
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/\n/g, '<br />');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Converted from Markdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: rgba(27,31,35,0.05);
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 3px;
        }
        pre code {
            padding: 0;
            background-color: transparent;
        }
        blockquote {
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
            margin: 0;
        }
        ul, ol {
            padding-left: 2em;
        }
        hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #e1e4e8;
            border: 0;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;
}

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
