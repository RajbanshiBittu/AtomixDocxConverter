import { htmlToPdfEngine } from "../engines/htmlToPdf.engine.js";

export async function runHtmlToPdfConversion({ inputFile }) {
    return htmlToPdfEngine.convert(inputFile);
}
