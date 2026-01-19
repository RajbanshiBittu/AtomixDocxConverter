import { libreOfficeEngine } from "../engines/libreOffice.engine.js";

export async function runConversion({ inputFile, targetFormat }) {
    if (targetFormat === "pdf") {
        return libreOfficeEngine.convert(inputFile);
    }

    throw new Error("Unsupported conversion");
}
