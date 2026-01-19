Goal

Fix the pdf-parse usage so PDF→JSON and PDF→Text use it reliably.
Implement a low-complexity PDF→DOCX path that is Node-only and falls back to a small optional Python converter if needed.
Repository context

Node ESM project with existing engines in engines:
pdfToOfficeJson.engine.js
pdfToOfficeText.engine.js
pdfToOfficeDocx.engine.js
LibreOffice CLI available as soffice (used elsewhere).
Existing helpers: job workspace creator, libreOfficeConfig, cheerio.
Implementation instructions (step-by-step)

Make pdf-parse import robust (apply to pdfToOfficeText.engine.js and pdfToOfficeJson.engine.js)
Replace current import with this pattern:
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const _pdfParse = require('pdf-parse');
const pdfParse = (typeof _pdfParse === 'function') ? _pdfParse : (_pdfParse.default || _pdfParse);
Usage:
const pdfData = await pdfParse(dataBuffer);
Rationale: handles both CJS and ESM export shapes, avoids "pdf is not a function".
PDF → JSON engine flow (minimal complexity, robust)
Try primary path: pdf-parse extraction
Read file into buffer, call await pdfParse(buffer).
If success and pdfData.text has sufficient length, build JSON with:
metadata: filename, size, pageCount (pdfData.numpages), info fields
content: fullText: pdfData.text, pages[] (split heuristically by form feed or use pdfData.text.split(/\f/))
tables: empty array (if none detected)
extraction: { method: 'pdf-parse', ocrUsed: false, timestamp }
Fallback path if pdf-parse throws or returns minimal text:
Convert PDF → HTML using LibreOffice:
soffice --headless --convert-to html --outdir <working> <input.pdf>
Parse HTML with cheerio:
Extract <table> elements into arrays of rows/cells
Extract <p>, <h*> into text blocks
Note images (<img src="...">) and include paths (store under output/images/)
Build JSON with same schema, set extraction.method = 'libreoffice-html'
Optional secondary fallback: if HTML parsing yields nothing, call pdftotext -layout (if available) for another plain-text source and set method 'pdftotext'.
Always write manifest.json with processing.method showing the final method used and pagesProcessed, tablesFound.
PDF → Text engine flow (same pdf-parse normalization + fallback)
Use normalized pdfParse call first.
If extractedText short or empty, run LibreOffice HTML conversion and strip tags for readable text.
If still empty, mark ocrUsed=true and return placeholder or call Tesseract only if user has installed it (document requirement).
Keep existing outputs and manifest format; ensure tools.pdfParse entry exists.
PDF → DOCX (low-complexity Node-only approach + optional Python fallback)
Primary path (Node-only, minimal complexity):
Convert PDF → HTML via LibreOffice:
soffice --headless --convert-to html --outdir <working> <input.pdf>
Read the generated HTML file (name: <base>.html) and sanitize:
remove <script>/<style>, inline images if present (copy images from working dir)
ensure HTML has <html><body>...</body></html>
Convert HTML → DOCX using html-docx-js:
npm install html-docx-js
In ESM context: use createRequire to require if necessary.
Example usage:
const htmlDocx = require('html-docx-js/dist/html-docx'); // or import via createRequire
const docxBuffer = htmlDocx.asBlob(<html><body>${htmlContent}</body></html>);
await fs.writeFile(outputPath, Buffer.from(docxBuffer));
Create manifest with processing.method='libreoffice-html+html-docx-js'
Note: this preserves inline text and basic structure (headings, paragraphs, simple tables), but complex layout and exact formatting will not be identical to source PDF.
Optional higher-fidelity fallback (if Node-only output unsatisfactory or if html-docx-js produces poor results):
Use pdf2docx (Python package) via a tiny wrapper script:
pip install pdf2docx
Provide a small script tools/pdf2docx_wrapper.py:
from pdf2docx import Converter
Converter('input.pdf').convert('output.docx'); Converter.close()
From Node, spawn python3 tools/pdf2docx_wrapper.py <in> <out> and await completion.
If Python fallback used, set manifest method 'pdf2docx-python'.
Document Python dependency in README and make this fallback optional (only used if python binary exists).
Dependencies to add
npm:
html-docx-js
(optional) pdfjs-dist if you prefer pure JS page extraction for advanced cases
system:
(optional) poppler-utils (pdftotext, pdftohtml) for more reliable CLI fallbacks
(optional) Python + pip install pdf2docx for DOCX fallback
(optional) tesseract if OCR needed
Tests to run after implementation
PDF → JSON:
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-json -F "file=@test-files/test.pdf" -o test-outputs/output.json
Check test-outputs/output.json contains extraction.method and document.pageCount
PDF → DOCX:
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-docx -F "file=@test-files/test.pdf" -o test-outputs/output.docx
Verify file exists and manifest shows libreoffice-html+html-docx-js or pdf2docx-python.
Logging & manifest
Add warning logs when falling back (e.g., "pdf-parse failed, falling back to LibreOffice HTML").
Ensure manifest.processing.method reports which method produced the output.
One-line acceptance criteria

/pdf-to-json returns a well-formed JSON file with metadata and content using pdf-parse if available, otherwise libreoffice-html or pdftotext, and logs the method used.
/pdf-to-docx returns a .docx produced from HTML→DOCX via html-docx-js, with an optional Python pdf2docx fallback if requested.
If you want, I can now:

(A) Draft the exact minimal code patches (diff) for pdfToOfficeJson.engine.js, pdfToOfficeText.engine.js, and pdfToOfficeDocx.engine.js, or
(B) Provide the exact shell/npm/pip commands to install dependencies and run quick manual tests.