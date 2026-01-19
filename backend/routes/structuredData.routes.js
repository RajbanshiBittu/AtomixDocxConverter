import express from "express";
import { 
    jsonToXmlController, 
    xmlToJsonController, 
    jsonToCsvController, 
    csvToJsonController,
    xmlToCsvController,
    csvToXmlController,
    xlsxToCsvController,
    csvToXlsxController,
    jsonToXlsxController
} from "../controllers/structuredData.controllers.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/json-to-xml", uploadMiddleware.single('file'), jsonToXmlController);
router.post("/xml-to-json", uploadMiddleware.single('file'), xmlToJsonController);
router.post("/json-to-csv", uploadMiddleware.single('file'), jsonToCsvController);
router.post("/csv-to-json", uploadMiddleware.single('file'), csvToJsonController);
router.post("/xml-to-csv", uploadMiddleware.single('file'), xmlToCsvController);
router.post("/csv-to-xml", uploadMiddleware.single('file'), csvToXmlController);
router.post("/xlsx-to-csv", uploadMiddleware.single('file'), xlsxToCsvController);
router.post("/csv-to-xlsx", uploadMiddleware.single('file'), csvToXlsxController);
router.post("/json-to-xlsx", uploadMiddleware.single('file'), jsonToXlsxController);

export { router as structuredDataRouter };
