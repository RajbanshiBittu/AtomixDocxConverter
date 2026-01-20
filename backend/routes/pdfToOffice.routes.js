import express from "express";
import { 
    pdfToTextController, 
    pdfToDocxController, 
    pdfToXlsxController, 
    pdfToJsonController, 
    pdfToCsvController 
} from "../controllers/pdfToOffice.controllers.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/pdf-to-text", uploadMiddleware.single('file'), pdfToTextController);
router.post("/pdf-to-docx", uploadMiddleware.single('file'), pdfToDocxController);
router.post("/pdf-to-xlsx", uploadMiddleware.single('file'), pdfToXlsxController);
router.post("/pdf-to-json", uploadMiddleware.single('file'), pdfToJsonController);
router.post("/pdf-to-csv", uploadMiddleware.single('file'), pdfToCsvController);

export { router as pdfToOfficeRouter };
    