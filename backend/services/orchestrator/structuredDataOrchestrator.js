import { structuredDataEngine } from "../engines/structuredData.engine.js";

export async function runStructuredDataConversion({ inputFile, sourceFormat, targetFormat }) {
    return structuredDataEngine.convert(inputFile, sourceFormat, targetFormat);
}
