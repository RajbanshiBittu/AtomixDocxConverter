import { pdfToCsvEngine } from "../engines/pdfToOfficeCsv.engine.js";
import path from "path";
import fs from "fs/promises";

export async function runPdfToCsvConversion({ inputFile, mode = 'structured' }) {
    try {
        // Run the conversion through the engine
        const result = await pdfToCsvEngine.convert(inputFile, mode);

        // Write manifest file
        const manifestPath = path.join(result.outputDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(result.manifest, null, 2));

        return {
            outputPath: result.outputPath,
            manifestPath: manifestPath,
            metadata: result.manifest
        };
    } catch (error) {
        console.error('PDF to csv orchestrator error:', error);
        throw error;
    }
}
