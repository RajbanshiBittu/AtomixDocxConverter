# AtomixDocxConverter - Backend

Document conversion API with support for multiple format conversions including Office documents, PDFs, structured data, and text/markdown.

## Features

### Conversion Categories

1. **Office to PDF** (6 conversions)
   - DOCX → PDF
   - XLSX → PDF
   - PPTX → PDF
   - ODT → PDF
   - ODS → PDF
   - HTML → PDF

2. **Open Documents** (4 conversions)
   - DOCX ↔ ODT
   - XLSX ↔ ODS

3. **Structured Data** (9 conversions)
   - JSON ↔ XML
   - JSON ↔ CSV
   - XML ↔ CSV
   - XLSX ↔ CSV
   - JSON → XLSX

4. **Text/Markdown** (5 conversions)
   - Text ↔ Markdown
   - Markdown ↔ HTML
   - HTML ↔ Markdown
   - DOCX → Markdown

5. **PDF to Office** (5 conversions) ✨ NEW
   - PDF → Text
   - PDF → DOCX
   - PDF → XLSX
   - PDF → JSON
   - PDF → CSV

**Total: 29 conversion endpoints**

## System Requirements

### Required Dependencies

1. **LibreOffice** (required for most conversions)
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y libreoffice

   # macOS
   brew install --cask libreoffice

   # Verify installation
   soffice --version
   ```

2. **Node.js** (v18 or higher)
   ```bash
   node --version
   npm --version
   ```

### Optional Dependencies

1. **Poppler Utils** (optional, for enhanced PDF processing)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y poppler-utils

   # macOS
   brew install poppler
   ```

2. **Tesseract OCR** (future enhancement for OCR support)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y tesseract-ocr

   # macOS
   brew install tesseract
   ```

## Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```bash
GET /health
```

### PDF to Office Conversions

#### 1. PDF to Text
```bash
POST /api/v1/pdf-to-office/pdf-to-text
Content-Type: multipart/form-data

# Example using curl
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-text \
  -F "file=@document.pdf" \
  -o output.txt

# With mode parameter (fast/structured/ocr)
curl -X POST "http://localhost:5000/api/v1/pdf-to-office/pdf-to-text?mode=fast" \
  -F "file=@document.pdf" \
  -o output.txt
```

#### 2. PDF to DOCX
```bash
POST /api/v1/pdf-to-office/pdf-to-docx

# Example
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-docx \
  -F "file=@document.pdf" \
  -o output.docx
```

#### 3. PDF to XLSX
```bash
POST /api/v1/pdf-to-office/pdf-to-xlsx

# Example
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-xlsx \
  -F "file=@document.pdf" \
  -o output.xlsx
```

#### 4. PDF to JSON
```bash
POST /api/v1/pdf-to-office/pdf-to-json

# Example
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-json \
  -F "file=@document.pdf" \
  -o output.json
```

#### 5. PDF to CSV
```bash
POST /api/v1/pdf-to-office/pdf-to-csv

# Example
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-csv \
  -F "file=@document.pdf" \
  -o output.csv
```

### Mode Parameters

PDF conversions support different processing modes via query parameter:

- `?mode=fast` - Quick extraction (default for text)
- `?mode=structured` - Enhanced structure preservation (default for XLSX/JSON/CSV)
- `?mode=ocr` - OCR processing for scanned PDFs (requires tesseract.js)

### Other Conversion Endpoints

- Office to PDF: `/api/v1/office-to-pdf/*`
- Open Documents: `/api/v1/open-documents/*`
- Structured Data: `/api/v1/structured-data/*`
- Text/Markdown: `/api/v1/text-markdown/*`

## Architecture

```
backend/
├── routes/              # API route definitions
│   └── pdfToOffice.routes.js
├── controllers/         # Request handlers
│   └── pdfToOffice.controllers.js
├── services/
│   ├── orchestrator/    # Conversion workflow orchestration
│   │   ├── pdfToOfficeTextOrchestrator.js
│   │   ├── pdfToOfficeDocxOrchestrator.js
│   │   ├── pdfToOfficeXlsxOrchestrator.js
│   │   ├── pdfToOfficeJsonOrchestrator.js
│   │   └── pdfToOfficeCsvOrchestrator.js
│   ├── engines/         # Core conversion logic
│   │   ├── pdfToOfficeText.engine.js
│   │   ├── pdfToOfficeDocx.engine.js
│   │   ├── pdfToOfficeXlsx.engine.js
│   │   ├── pdfToOfficeJson.engine.js
│   │   └── pdfToOfficeCsv.engine.js
│   └── jobs/           # Job management
│       └── jobManager.js
├── middlewares/        # Express middlewares
├── utils/              # Utilities
├── config/             # Configuration files
└── storage/            # File storage
    ├── uploads/        # Uploaded files (temporary)
    ├── working/        # Processing workspace
    └── outputs/        # Conversion outputs + manifests
```

## Output Structure

Each conversion creates a job directory with:

```
storage/outputs/<job-id>/
├── output.<ext>        # Converted file
└── manifest.json       # Conversion metadata
```

### Manifest Example

```json
{
  "jobId": "uuid-v4",
  "conversion": "pdf-to-text",
  "input": {
    "filename": "document.pdf",
    "size": 245678
  },
  "output": {
    "filename": "document.txt",
    "size": 12345
  },
  "processing": {
    "method": "pdf-parse",
    "mode": "fast",
    "ocrUsed": false,
    "duration": 1234,
    "timestamp": "2026-01-19T12:00:00.000Z"
  },
  "tools": {
    "node": "v18.0.0",
    "pdfParse": "latest",
    "libreoffice": "/usr/bin/soffice"
  }
}
```

## Technology Stack

### Core Dependencies
- **Express** - Web framework
- **Multer** - File upload handling
- **LibreOffice** - Document conversions
- **Puppeteer** - HTML to PDF rendering

### PDF Processing
- **pdf-parse** - PDF text extraction
- **cheerio** - HTML parsing for table extraction
- **exceljs** - Excel file generation
- **csv-writer** - CSV file generation

### Utilities
- **uuid** - Unique job ID generation
- **dotenv** - Environment configuration
- **cors** - CORS support

## Known Limitations

### PDF to Office Conversions

1. **PDF → Text**
   - Scanned PDFs require OCR (tesseract.js not yet integrated)
   - Complex multi-column layouts may lose structure
   - Headers/footers detection is heuristic

2. **PDF → DOCX**
   - Complex layouts may be partially rasterized by LibreOffice
   - Best results with text-based PDFs
   - Scanned PDFs will convert but may contain images instead of editable text

3. **PDF → XLSX**
   - Table detection relies on HTML structure from LibreOffice
   - Fidelity varies with PDF complexity
   - Merged cells and nested tables may not preserve perfectly

4. **PDF → JSON**
   - Page boundaries may not be perfectly preserved
   - Coordinate information is limited
   - Best for content extraction, not layout reconstruction

5. **PDF → CSV**
   - Best results with PDFs containing clear tables
   - Multiple tables are combined with markers
   - Text-only PDFs output single-column CSV

### Performance
- Large PDFs (>50MB) may take significant time
- Complex conversions can be CPU-intensive
- Consider implementing job queuing for production

## Error Handling

The API uses structured error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "path": "/api/v1/pdf-to-office/pdf-to-text"
  }
}
```

Common error codes:
- `400` - Bad request (invalid file type, missing file)
- `404` - Route not found
- `500` - Internal server error (conversion failed)

## Testing

### Manual Testing with Sample PDFs

Place test PDFs in `backend/test-pdfs/`:
- `text-based.pdf` - Born-digital PDF with selectable text
- `scanned.pdf` - Scanned document image
- `tables.pdf` - PDF containing tables

Test commands:
```bash
# Test PDF to Text
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-text \
  -F "file=@test-pdfs/text-based.pdf" \
  -o test-output.txt

# Test PDF to XLSX
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-xlsx \
  -F "file=@test-pdfs/tables.pdf" \
  -o test-output.xlsx
```

## Docker Support

### Dockerfile Example

```dockerfile
FROM node:18

# Install LibreOffice and system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Build and Run

```bash
docker build -t atomix-converter-backend .
docker run -p 5000:5000 -v $(pwd)/storage:/app/storage atomix-converter-backend
```

## Contributing

1. Follow the existing architecture pattern (route → controller → orchestrator → engine)
2. Name new conversion files consistently (e.g., `formatToFormat.*`)
3. Update `fileValidator.js` with new conversion types
4. Add comprehensive error handling
5. Include conversion manifest generation
6. Update this README with new endpoints

## License

ISC

## Support

For issues and questions, please open an issue on the project repository.
