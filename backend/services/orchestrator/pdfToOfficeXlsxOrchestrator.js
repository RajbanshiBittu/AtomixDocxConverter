import { pdfToXlsxEngine } from "../engines/pdfToOfficeXlsx.engine.js";
import path from "path";
import fs from "fs/promises";

export async function runPdfToXlsxConversion({ inputFile, mode = 'structured' }) {
    try {
        // Run the conversion through the engine
        const result = await pdfToXlsxEngine.convert(inputFile, mode);

        // Write manifest file
        const manifestPath = path.join(result.outputDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(result.manifest, null, 2));

        return {
            outputPath: result.outputPath,
            manifestPath: manifestPath,
            metadata: result.manifest
        };
    } catch (error) {
        console.error('PDF to xlsx orchestrator error:', error);
        throw error;
    }
}
