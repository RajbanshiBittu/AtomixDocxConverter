import { docxConversionEngine } from "../engines/docxConversion.engine.js";
import { pptxConversionEngine } from "../engines/pptxConversion.engine.js";
import { txtConversionEngine } from "../engines/txtConversion.engine.js";
import { pdfToHtmlEngine } from "../engines/pdfToHtml.engine.js";
import { markdownConversionEngine } from "../engines/markdownConversion.engine.js";
import { xlsxConversionEngine } from "../engines/xlsxConversion.engine.js";
import { odsConversionEngine } from "../engines/odsConversion.engine.js";
import { odtConversionEngine } from "../engines/odtConversion.engine.js";
import { csvConversionEngine } from "../engines/csvConversion.engine.js";
import { jsonConversionEngine } from "../engines/jsonConversion.engine.js";
import { xmlConversionEngine } from "../engines/xmlConversion.engine.js";
import { htmlConversionEngine } from "../engines/htmlConversion.engine.js";

/**
 * Comprehensive conversion orchestrator for all 43 new conversions
 * Maps conversion types to their respective engine methods
 */
export const comprehensiveConversionOrchestrator = {
    // DOCX conversions (4)
    async docxToTxt(inputFile) {
        return await docxConversionEngine.convertToTxt(inputFile);
    },

    async docxToHtml(inputFile) {
        return await docxConversionEngine.convertToHtml(inputFile);
    },

    async docxToPptx(inputFile) {
        return await docxConversionEngine.convertToPptx(inputFile);
    },

    async docxToXlsx(inputFile) {
        return await docxConversionEngine.convertToXlsx(inputFile);
    },

    // PPTX conversions (3)
    async pptxToTxt(inputFile) {
        return await pptxConversionEngine.convertToTxt(inputFile);
    },

    async pptxToHtml(inputFile) {
        return await pptxConversionEngine.convertToHtml(inputFile);
    },

    async pptxToMd(inputFile) {
        return await pptxConversionEngine.convertToMarkdown(inputFile);
    },

    // TXT conversions (4)
    async txtToDocx(inputFile) {
        return await txtConversionEngine.convertToDocx(inputFile);
    },

    async txtToPdf(inputFile) {
        return await txtConversionEngine.convertToPdf(inputFile);
    },

    async txtToHtml(inputFile) {
        return await txtConversionEngine.convertToHtml(inputFile);
    },

    async txtToMd(inputFile) {
        return await txtConversionEngine.convertToMarkdown(inputFile);
    },

    // PDF conversions (1)
    async pdfToHtml(inputFile) {
        return await pdfToHtmlEngine.convert(inputFile);
    },

    // Markdown conversions (4)
    async mdToPdf(inputFile) {
        return await markdownConversionEngine.convertToPdf(inputFile);
    },

    async mdToDocx(inputFile) {
        return await markdownConversionEngine.convertToDocx(inputFile);
    },

    async mdToOdt(inputFile) {
        return await markdownConversionEngine.convertToOdt(inputFile);
    },

    async mdToPptx(inputFile) {
        return await markdownConversionEngine.convertToPptx(inputFile);
    },

    // XLSX conversions (4)
    async xlsxToJson(inputFile) {
        return await xlsxConversionEngine.convertToJson(inputFile);
    },

    async xlsxToXml(inputFile) {
        return await xlsxConversionEngine.convertToXml(inputFile);
    },

    async xlsxToHtml(inputFile) {
        return await xlsxConversionEngine.convertToHtml(inputFile);
    },

    async xlsxToTxt(inputFile) {
        return await xlsxConversionEngine.convertToTxt(inputFile);
    },

    // ODS conversions (3)
    async odsToCsv(inputFile) {
        return await odsConversionEngine.convertToCsv(inputFile);
    },

    async odsToHtml(inputFile) {
        return await odsConversionEngine.convertToHtml(inputFile);
    },

    async odsToTxt(inputFile) {
        return await odsConversionEngine.convertToTxt(inputFile);
    },

    // ODT conversions (4)
    async odtToTxt(inputFile) {
        return await odtConversionEngine.convertToTxt(inputFile);
    },

    async odtToHtml(inputFile) {
        return await odtConversionEngine.convertToHtml(inputFile);
    },

    async odtToMd(inputFile) {
        return await odtConversionEngine.convertToMarkdown(inputFile);
    },

    async odtToPptx(inputFile) {
        return await odtConversionEngine.convertToPptx(inputFile);
    },

    // CSV conversions (4)
    async csvToXml(inputFile) {
        return await csvConversionEngine.convertToXml(inputFile);
    },

    async csvToHtml(inputFile) {
        return await csvConversionEngine.convertToHtml(inputFile);
    },

    async csvToPdf(inputFile) {
        return await csvConversionEngine.convertToPdf(inputFile);
    },

    async csvToTxt(inputFile) {
        return await csvConversionEngine.convertToTxt(inputFile);
    },

    // JSON conversions (4)
    async jsonToCsv(inputFile) {
        return await jsonConversionEngine.convertToCsv(inputFile);
    },

    async jsonToXlsx(inputFile) {
        return await jsonConversionEngine.convertToXlsx(inputFile);
    },

    async jsonToHtml(inputFile) {
        return await jsonConversionEngine.convertToHtml(inputFile);
    },

    async jsonToMd(inputFile) {
        return await jsonConversionEngine.convertToMarkdown(inputFile);
    },

    // XML conversions (4)
    async xmlToCsv(inputFile) {
        return await xmlConversionEngine.convertToCsv(inputFile);
    },

    async xmlToXlsx(inputFile) {
        return await xmlConversionEngine.convertToXlsx(inputFile);
    },

    async xmlToHtml(inputFile) {
        return await xmlConversionEngine.convertToHtml(inputFile);
    },

    async xmlToPdf(inputFile) {
        return await xmlConversionEngine.convertToPdf(inputFile);
    },

    // HTML conversions (4)
    async htmlToDocx(inputFile) {
        return await htmlConversionEngine.convertToDocx(inputFile);
    },

    async htmlToTxt(inputFile) {
        return await htmlConversionEngine.convertToTxt(inputFile);
    },

    async htmlToXlsx(inputFile) {
        return await htmlConversionEngine.convertToXlsx(inputFile);
    },

    async htmlToCsv(inputFile) {
        return await htmlConversionEngine.convertToCsv(inputFile);
    }
};
