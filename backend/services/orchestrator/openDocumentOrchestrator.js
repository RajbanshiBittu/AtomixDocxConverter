import { openDocumentEngine } from "../engines/openDocument.engine.js";

export async function runOpenDocumentConversion({ inputFile, targetFormat }) {
    return openDocumentEngine.convert(inputFile, targetFormat);
}
