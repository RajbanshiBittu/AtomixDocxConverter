import { docxToMarkdownEngine } from "../engines/docxToMarkdown.engine.js";

export async function runDocxToMarkdownConversion({ inputFile }) {
    return docxToMarkdownEngine.convert(inputFile);
}
