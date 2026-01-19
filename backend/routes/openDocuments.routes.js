import express from "express";
import { 
    docxToOdtController, 
    odtToDocxController, 
    xlsxToOdsController, 
    odsToXlsxController 
} from "../controllers/openDocuments.controllers.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/docx-to-odt", uploadMiddleware.single('file'), docxToOdtController);
router.post("/odt-to-docx", uploadMiddleware.single('file'), odtToDocxController);
router.post("/xlsx-to-ods", uploadMiddleware.single('file'), xlsxToOdsController);
router.post("/ods-to-xlsx", uploadMiddleware.single('file'), odsToXlsxController);

export { router as openDocumentsRouter };
