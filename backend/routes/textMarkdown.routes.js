import express from "express";
import { 
    textToMdController, 
    mdToTextController, 
    mdToHtmlController, 
    htmlToMdController,
    docxToMdController 
} from "../controllers/textMarkdown.controllers.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/text-to-md", uploadMiddleware.single('file'), textToMdController);
router.post("/md-to-text", uploadMiddleware.single('file'), mdToTextController);
router.post("/md-to-html", uploadMiddleware.single('file'), mdToHtmlController);
router.post("/html-to-md", uploadMiddleware.single('file'), htmlToMdController);
router.post("/docx-to-md", uploadMiddleware.single('file'), docxToMdController);

export { router as textMarkdownRouter };
