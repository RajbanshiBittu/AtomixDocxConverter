import path from "path";
import fs from "fs/promises";
import createJobWorkspace from "../jobs/jobManager.js";

export const textMarkdownEngine = {
    async convert(inputFile, sourceFormat, targetFormat) {
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        await fs.rename(inputFile.path, inputPath);

        const inputContent = await fs.readFile(inputPath, 'utf-8');

        let outputContent;
        const parsed = path.parse(inputFile.originalname);
        const outputFile = parsed.name + "." + targetFormat;
        const outputPath = path.join(job.outputDir, outputFile);

        // Conversion logic
        if (sourceFormat === 'text' && targetFormat === 'md') {
            outputContent = textToMarkdown(inputContent);
        } else if (sourceFormat === 'md' && targetFormat === 'text') {
            outputContent = markdownToText(inputContent);
        } else if (sourceFormat === 'md' && targetFormat === 'html') {
            outputContent = markdownToHtml(inputContent);
        } else if (sourceFormat === 'html' && targetFormat === 'md') {
            outputContent = htmlToMarkdown(inputContent);
        } else {
            throw new Error(`Unsupported conversion: ${sourceFormat} to ${targetFormat}`);
        }

        await fs.writeFile(outputPath, outputContent, 'utf-8');

        return { outputPath };
    }
};

// Text to Markdown - wraps plain text in code blocks
function textToMarkdown(text) {
    // Preserve the original text formatting
    return text;
}

// Markdown to Text - strips markdown syntax
function markdownToText(markdown) {
    let text = markdown;
    
    // Remove headers (# ## ###)
    text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1');
    
    // Remove bold/italic (**text** *text* __text__ _text_)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // Remove links [text](url)
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // Remove images ![alt](url)
    text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
    
    // Remove inline code `code`
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // Remove code blocks ```code```
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // Remove blockquotes
    text = text.replace(/^>\s+/gm, '');
    
    // Remove horizontal rules
    text = text.replace(/^([-*_]){3,}$/gm, '');
    
    // Remove list markers
    text = text.replace(/^[\s]*[-*+]\s+/gm, '');
    text = text.replace(/^[\s]*\d+\.\s+/gm, '');
    
    return text.trim();
}

// Markdown to HTML
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    
    // Bold
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
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Blockquotes
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^([-*_]){3,}$/gm, '<hr />');
    
    // Unordered lists
    html = html.replace(/^[\s]*[-*+]\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>\n$&</ul>\n');
    
    // Ordered lists
    html = html.replace(/^[\s]*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    
    // Paragraphs
    html = html.replace(/^(?!<[huo]|<li|<pre|<blockquote)(.+)$/gm, '<p>$1</p>');
    
    // Wrap in HTML structure
    html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
</head>
<body>
${html}
</body>
</html>`;
    
    return html;
}

// HTML to Markdown
function htmlToMarkdown(html) {
    let markdown = html;
    
    // Remove HTML doctype and structure
    markdown = markdown.replace(/<!DOCTYPE[^>]*>/gi, '');
    markdown = markdown.replace(/<html[^>]*>/gi, '');
    markdown = markdown.replace(/<\/html>/gi, '');
    markdown = markdown.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    markdown = markdown.replace(/<body[^>]*>/gi, '');
    markdown = markdown.replace(/<\/body>/gi, '');
    
    // Headers
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
    
    // Bold
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    
    // Italic
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    
    // Links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Images
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
    markdown = markdown.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
    markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');
    
    // Code blocks
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n');
    
    // Inline code
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
    
    // Horizontal rules
    markdown = markdown.replace(/<hr[^>]*\/?>/gi, '\n---\n');
    
    // Lists
    markdown = markdown.replace(/<ul[^>]*>/gi, '');
    markdown = markdown.replace(/<\/ul>/gi, '\n');
    markdown = markdown.replace(/<ol[^>]*>/gi, '');
    markdown = markdown.replace(/<\/ol>/gi, '\n');
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // Paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Line breaks
    markdown = markdown.replace(/<br[^>]*\/?>/gi, '\n');
    
    // Remove remaining HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');
    
    // Clean up excessive newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
}
