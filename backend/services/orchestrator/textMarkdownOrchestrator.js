import { textMarkdownEngine } from "../engines/textMarkdown.engine.js";

export async function runTextMarkdownConversion({ inputFile, sourceFormat, targetFormat }) {
    return textMarkdownEngine.convert(inputFile, sourceFormat, targetFormat);
}
