# PDF Conversion Endpoints - Test Results

**Test Date:** 2026-01-19  
**Test PDF:** `test-files/test.pdf` (11MB, 5000 records with tables)  
**Backend Server:** Node.js v25.2.1, Express v5.2.1 on localhost:5000

---

## Summary

| Endpoint | Status | Output Size | Duration | Method | Notes |
|----------|--------|-------------|----------|--------|-------|
| `/pdf-to-text` | ✅ WORKING | 284 KB | ~16s | LibreOffice HTML fallback | pdf-parse failed, fallback succeeded |
| `/pdf-to-docx` | ❌ FAILED | N/A | ~14s | LibreOffice | LibreOffice cannot convert PDF→DOCX directly |
| `/pdf-to-xlsx` | ✅ WORKING | 248 KB | ~16s | LibreOffice→Cheerio→ExcelJS | Created Excel with extracted text |
| `/pdf-to-json` | ❌ FAILED | N/A | <1s | pdf-parse | Module error: "pdf is not a function" |
| `/pdf-to-csv` | ✅ WORKING | 348 KB | ~16s | LibreOffice→Cheerio→CSV | Created CSV from text content |

**Success Rate:** 3/5 endpoints (60%) fully functional

---

## Detailed Results

### 1. PDF → Text ✅
```bash
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-text \
  -F "file=@test-files/test.pdf" \
  -o test-outputs/output.txt
```

**Status:** HTTP 200 OK  
**Duration:** 15-17 seconds  
**Output:** 284 KB text file  
**Method:** LibreOffice HTML fallback (pdf-parse primary method failed)  
**Quality:** Readable text extracted successfully

**Issue:** pdf-parse library throws error: "pdf is not a function"
- Root cause: CommonJS/ESM module incompatibility
- Current workaround: Uses LibreOffice to convert PDF→HTML, then extracts text
- Impact: Still functional but using fallback method

**Manifest:**
```json
{
  "jobId": "04e6ba1b-bcfc-412c-b1e0-b74f101b64fe",
  "conversion": "pdf-to-text",
  "method": "libreoffice-html",
  "ocrUsed": false,
  "duration": 15656
}
```

---

### 2. PDF → DOCX ❌
```bash
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-docx \
  -F "file=@test-files/test.pdf" \
  -o test-outputs/output.docx
```

**Status:** HTTP 500 Internal Server Error  
**Duration:** ~14 seconds  
**Error:** `Conversion failed: Output file not created`  

**Root Cause:** LibreOffice does not support PDF→DOCX conversion
- LibreOffice can convert FROM DOCX to PDF, but not the reverse
- PDFs are "print-ready" formats, not easily editable
- Direct PDF→DOCX requires OCR or complex layout analysis

**Possible Solutions:**
1. **pdf2docx library** (Python-based, can be called via child_process)
2. **pdf-lib + docx library** (extract content manually, rebuild in DOCX)
3. **Commercial APIs** (Adobe PDF Services, CloudConvert, etc.)
4. **Remove this endpoint** and document the limitation

**Recommendation:** Document as unsupported or implement pdf2docx as alternative

---

### 3. PDF → Excel (XLSX) ✅
```bash
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-xlsx \
  -F "file=@test-files/test.pdf" \
  -o test-outputs/output.xlsx
```

**Status:** HTTP 200 OK  
**Duration:** ~16 seconds  
**Output:** 248 KB Excel file  
**Method:** LibreOffice PDF→HTML → Cheerio table extraction → ExcelJS

**Quality:** Successfully created Excel file
- Extracted text content organized into spreadsheet
- Note: "No tables found in PDF, creating single sheet with extracted text"
- Tables may not be perfectly detected from PDF layout

**Use Case:** Best for PDFs with clear tabular data or when text extraction to Excel is needed

---

### 4. PDF → JSON ❌
```bash
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-json \
  -F "file=@test-files/test.pdf" \
  -o test-outputs/output.json
```

**Status:** HTTP 500 Internal Server Error  
**Duration:** <1 second (failed quickly)  
**Error:** `pdf is not a function`

**Root Cause:** Same pdf-parse module issue as pdf-to-text
- Unlike pdf-to-text, this endpoint has no fallback method
- Requires pdf-parse for metadata and structured extraction
- Current CommonJS `require()` workaround not working

**Fix Required:**
```javascript
// Current (broken):
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
await pdf(dataBuffer); // Error: pdf is not a function

// Potential fix:
const pdfParse = require('pdf-parse');
await pdfParse(dataBuffer);

// Or check pdf-parse exports:
const pdf = require('pdf-parse');
await pdf.default(dataBuffer); // if default export
```

---

### 5. PDF → CSV ✅
```bash
curl -X POST http://localhost:5000/api/v1/pdf-to-office/pdf-to-csv \
  -F "file=@test-files/test.pdf" \
  -o test-outputs/output.csv
```

**Status:** HTTP 200 OK  
**Duration:** ~16 seconds  
**Output:** 348 KB CSV file  
**Method:** LibreOffice PDF→HTML → Cheerio table extraction → CSV writer

**Quality:** Successfully created CSV with extracted content
- First line shows sheet name: "Sheet1"
- Subsequent lines contain data
- Note: "No tables found in PDF, creating CSV from text content"

**Sample Output:**
```csv
Content
"Sheet1"
"Page 1"
"First Name"
"Last Name"
"Gender"
"Country"
...
```

---

## Issues & Recommendations

### Issue 1: pdf-parse Module Not Working
**Severity:** Medium (2 endpoints affected)  
**Affected Endpoints:** pdf-to-text (fallback working), pdf-to-json (completely broken)

**Current Error:**
```
TypeError: pdf is not a function
    at pdfToOfficeText.engine.js:30
```

**Investigation Needed:**
1. Check pdf-parse package.json exports structure
2. Test different import methods (default export, named export, etc.)
3. Verify pdf-parse is properly installed: `npm list pdf-parse`
4. Try alternative PDF parsing libraries: `pdf-extraction`, `pdfjs-dist`

**Temporary Workaround:**
- pdf-to-text: Uses LibreOffice HTML method successfully
- pdf-to-json: No workaround currently implemented

---

### Issue 2: PDF to DOCX Not Supported by LibreOffice
**Severity:** High (1 endpoint completely non-functional)  
**Affected Endpoints:** pdf-to-docx

**Why It's Hard:**
- PDFs are "final" documents with fixed layouts
- Converting to editable DOCX requires reverse-engineering layout
- Tables, images, fonts all need reconstruction
- No free, reliable solution exists

**Options:**
1. **Document Limitation:** Update README to state PDF→DOCX is not supported
2. **Implement pdf2docx (Python):**
   ```bash
   pip install pdf2docx
   # Call from Node.js via child_process
   ```
3. **Use Commercial API:** Adobe PDF Services, CloudConvert (requires API key)
4. **Remove Endpoint:** Comment it out and return 501 Not Implemented

**Recommendation:** Option 1 or 4 - document the limitation clearly

---

## Performance Summary

| Metric | Value |
|--------|-------|
| Average Success Time | 16 seconds |
| Average Failure Time | <14 seconds |
| LibreOffice Conversion | ~15-16s per file |
| Upload Time (11MB) | ~13-14s |

**Notes:**
- All working conversions take similar time (~16s) due to LibreOffice processing
- Large PDFs (11MB) take significant upload time
- LibreOffice is the performance bottleneck
- Consider implementing caching or async queue for production

---

## Test Outputs Created

```bash
backend/test-outputs/
├── output.txt     # 284 KB - text extraction (working)
├── output.docx    # Failed - not created
├── output.xlsx    # 248 KB - Excel file (working)
├── output.json    # 57 bytes - error message (failed)
└── output.csv     # 348 KB - CSV file (working)
```

---

## Next Steps

### Immediate Priorities

1. **Fix pdf-parse Module** (1-2 hours)
   - Debug CommonJS/ESM import issue
   - Test alternative import methods
   - Update engines to use correct syntax
   - Re-test pdf-to-text and pdf-to-json

2. **Document PDF→DOCX Limitation** (30 minutes)
   - Update README.md with known limitations
   - Add note in API documentation
   - Consider adding 501 Not Implemented response

3. **Verify Manifest Creation** (30 minutes)
   - Check that manifest.json files are created for successful conversions
   - Ensure metadata is accurate
   - Test download endpoints

### Optional Enhancements

4. **Improve Table Detection** (2-4 hours)
   - Better HTML table parsing for XLSX/CSV conversions
   - Handle multi-page tables
   - Preserve table formatting

5. **Add Alternative PDF Parsers** (2-3 hours)
   - Test `pdfjs-dist` as pdf-parse alternative
   - Implement fallback chain: pdf-parse → pdfjs-dist → LibreOffice

6. **Performance Optimization** (3-5 hours)
   - Implement job queue (Bull/Redis)
   - Add progress tracking for long conversions
   - Cache LibreOffice conversions

---

## Conclusion

**Working:** 3/5 endpoints (60%)
- ✅ PDF → Text (via fallback)
- ✅ PDF → Excel
- ✅ PDF → CSV

**Broken:** 2/5 endpoints (40%)
- ❌ PDF → DOCX (LibreOffice limitation)
- ❌ PDF → JSON (pdf-parse module issue)

**Overall Assessment:** The architecture is sound. The working endpoints demonstrate that the route → controller → orchestrator → engine pattern works well. The issues are:
1. Third-party library compatibility (pdf-parse)
2. LibreOffice tool limitations (no PDF→DOCX)

Both are solvable with the recommended fixes above.
