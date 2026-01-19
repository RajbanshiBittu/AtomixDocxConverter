import multer from "multer";

export const uploadMiddleware = multer({
  dest: "storage/uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }
});
