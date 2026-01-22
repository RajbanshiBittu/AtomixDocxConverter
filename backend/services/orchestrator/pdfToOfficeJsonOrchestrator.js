import { pdfToJsonEngine } from "../engines/pdfToOfficeJson.engine.js";
import path from "path";
import fs from "fs/promises";
import logger from "../../utils/logger.js";

export async function runPdfToJsonConversion({ inputFile, mode = 'structured' }) {
    try {
        // Run the conversion through the engine
        const result = await pdfToJsonEngine.convert(inputFile, mode);

        // Write manifest file
        const manifestPath = path.join(result.outputDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(result.manifest, null, 2));

        return {
            outputPath: result.outputPath,
            manifestPath: manifestPath,
            metadata: result.manifest
        };
    } catch (error) {
        logger.error('PDF to json orchestrator error:', error);
        throw error;
    }
}
