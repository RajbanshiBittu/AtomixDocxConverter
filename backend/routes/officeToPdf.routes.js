import express from "express";

import { docxToPdfController, xlsxToPdfController, pptxToPdfController, odsToPdfController, odtToPdfController, htmlToPdfController } from "../controllers/officeToPdf.controllers.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";


const router = express.Router();


router.post("/docx-to-pdf", uploadMiddleware.single('file'), docxToPdfController);
router.post("/xlsx-to-pdf", uploadMiddleware.single('file'), xlsxToPdfController);
router.post("/pptx-to-pdf", uploadMiddleware.single('file'), pptxToPdfController);
router.post("/ods-to-pdf", uploadMiddleware.single('file'), odsToPdfController);
router.post("/odt-to-pdf", uploadMiddleware.single('file'), odtToPdfController);
router.post("/html-to-pdf", uploadMiddleware.single('file'), htmlToPdfController);



export {router as officeToPdfRouter};