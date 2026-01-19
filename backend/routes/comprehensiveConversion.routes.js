import express from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";
import * as controllers from "../controllers/comprehensiveConversion.controllers.js";

const router = express.Router();

// ==================== DOCX CONVERSIONS (4) ====================
router.post("/docx-to-txt", uploadMiddleware.single('file'), controllers.docxToTxtController);
router.post("/docx-to-html", uploadMiddleware.single('file'), controllers.docxToHtmlController);
router.post("/docx-to-pptx", uploadMiddleware.single('file'), controllers.docxToPptxController);
router.post("/docx-to-xlsx", uploadMiddleware.single('file'), controllers.docxToXlsxController);

// ==================== PPTX CONVERSIONS (3) ====================
router.post("/pptx-to-txt", uploadMiddleware.single('file'), controllers.pptxToTxtController);
router.post("/pptx-to-html", uploadMiddleware.single('file'), controllers.pptxToHtmlController);
router.post("/pptx-to-md", uploadMiddleware.single('file'), controllers.pptxToMdController);

// ==================== TXT CONVERSIONS (4) ====================
router.post("/txt-to-docx", uploadMiddleware.single('file'), controllers.txtToDocxController);
router.post("/txt-to-pdf", uploadMiddleware.single('file'), controllers.txtToPdfController);
router.post("/txt-to-html", uploadMiddleware.single('file'), controllers.txtToHtmlController);
router.post("/txt-to-md", uploadMiddleware.single('file'), controllers.txtToMdController);

// ==================== PDF CONVERSIONS (1) ====================
router.post("/pdf-to-html", uploadMiddleware.single('file'), controllers.pdfToHtmlController);

// ==================== MARKDOWN CONVERSIONS (4) ====================
router.post("/md-to-pdf", uploadMiddleware.single('file'), controllers.mdToPdfController);
router.post("/md-to-docx", uploadMiddleware.single('file'), controllers.mdToDocxController);
router.post("/md-to-odt", uploadMiddleware.single('file'), controllers.mdToOdtController);
router.post("/md-to-pptx", uploadMiddleware.single('file'), controllers.mdToPptxController);

// ==================== XLSX CONVERSIONS (4) ====================
router.post("/xlsx-to-json", uploadMiddleware.single('file'), controllers.xlsxToJsonController);
router.post("/xlsx-to-xml", uploadMiddleware.single('file'), controllers.xlsxToXmlController);
router.post("/xlsx-to-html", uploadMiddleware.single('file'), controllers.xlsxToHtmlController);
router.post("/xlsx-to-txt", uploadMiddleware.single('file'), controllers.xlsxToTxtController);

// ==================== ODS CONVERSIONS (3) ====================
router.post("/ods-to-csv", uploadMiddleware.single('file'), controllers.odsToCsvController);
router.post("/ods-to-html", uploadMiddleware.single('file'), controllers.odsToHtmlController);
router.post("/ods-to-txt", uploadMiddleware.single('file'), controllers.odsToTxtController);

// ==================== ODT CONVERSIONS (4) ====================
router.post("/odt-to-txt", uploadMiddleware.single('file'), controllers.odtToTxtController);
router.post("/odt-to-html", uploadMiddleware.single('file'), controllers.odtToHtmlController);
router.post("/odt-to-md", uploadMiddleware.single('file'), controllers.odtToMdController);
router.post("/odt-to-pptx", uploadMiddleware.single('file'), controllers.odtToPptxController);

// ==================== CSV CONVERSIONS (4) ====================
router.post("/csv-to-xml", uploadMiddleware.single('file'), controllers.csvToXmlController);
router.post("/csv-to-html", uploadMiddleware.single('file'), controllers.csvToHtmlController);
router.post("/csv-to-pdf", uploadMiddleware.single('file'), controllers.csvToPdfController);
router.post("/csv-to-txt", uploadMiddleware.single('file'), controllers.csvToTxtController);

// ==================== JSON CONVERSIONS (4) ====================
router.post("/json-to-csv", uploadMiddleware.single('file'), controllers.jsonToCsvController);
router.post("/json-to-xlsx", uploadMiddleware.single('file'), controllers.jsonToXlsxController);
router.post("/json-to-html", uploadMiddleware.single('file'), controllers.jsonToHtmlController);
router.post("/json-to-md", uploadMiddleware.single('file'), controllers.jsonToMdController);

// ==================== XML CONVERSIONS (4) ====================
router.post("/xml-to-csv", uploadMiddleware.single('file'), controllers.xmlToCsvController);
router.post("/xml-to-xlsx", uploadMiddleware.single('file'), controllers.xmlToXlsxController);
router.post("/xml-to-html", uploadMiddleware.single('file'), controllers.xmlToHtmlController);
router.post("/xml-to-pdf", uploadMiddleware.single('file'), controllers.xmlToPdfController);

// ==================== HTML CONVERSIONS (4) ====================
router.post("/html-to-docx", uploadMiddleware.single('file'), controllers.htmlToDocxController);
router.post("/html-to-txt", uploadMiddleware.single('file'), controllers.htmlToTxtController);
router.post("/html-to-xlsx", uploadMiddleware.single('file'), controllers.htmlToXlsxController);
router.post("/html-to-csv", uploadMiddleware.single('file'), controllers.htmlToCsvController);

export { router as comprehensiveConversionRouter };
