import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../storage/uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + sanitized);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'text/plain',
    'text/html',
    'text/csv',
    'text/markdown',
    'application/json',
    'application/xml',
    'text/xml'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only documents are allowed.'));
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  limits: { 
    fileSize: 20 * 1024 * 1024,  // 20MB
    files: 1                      // Only 1 file per request
  },
  fileFilter: fileFilter
});;