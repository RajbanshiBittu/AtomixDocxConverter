#!/bin/bash

# ==========================================
# Comprehensive Backend Route Testing Script
# ==========================================
# Tests all 72 API endpoints in the backend
# ==========================================

BASE_URL="http://localhost:5050"
TEST_DIR="test-files"
OUTPUT_DIR="test-outputs-all-routes"
RESULTS_FILE="route-test-results.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_ROUTES=0
PASSED_ROUTES=0
FAILED_ROUTES=0

# Arrays to track results
declare -a PASSED_TESTS
declare -a FAILED_TESTS

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Initialize results file
echo "=======================================" > "$RESULTS_FILE"
echo "Backend Route Testing Results" >> "$RESULTS_FILE"
echo "Test Date: $(date)" >> "$RESULTS_FILE"
echo "=======================================" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Function to test a route
test_route() {
    local route=$1
    local file=$2
    local output_file=$3
    local endpoint="${BASE_URL}${route}"
    
    TOTAL_ROUTES=$((TOTAL_ROUTES + 1))
    
    echo -n "Testing: ${route} ... "
    
    # Check if test file exists
    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}SKIPPED${NC} (test file not found: $file)"
        echo "[SKIPPED] ${route} - Test file not found: $file" >> "$RESULTS_FILE"
        return
    fi
    
    # Make the request
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -F "file=@${file}" \
        "${endpoint}" \
        -o "${OUTPUT_DIR}/${output_file}" 2>&1)
    
    # Extract HTTP status code (last line)
    http_code=$(echo "$response" | tail -n 1)
    
    # Check if successful
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}PASSED${NC} (HTTP 200)"
        PASSED_ROUTES=$((PASSED_ROUTES + 1))
        PASSED_TESTS+=("${route}")
        echo "[PASSED] ${route} - HTTP 200" >> "$RESULTS_FILE"
    else
        echo -e "${RED}FAILED${NC} (HTTP ${http_code})"
        FAILED_ROUTES=$((FAILED_ROUTES + 1))
        FAILED_TESTS+=("${route} - HTTP ${http_code}")
        echo "[FAILED] ${route} - HTTP ${http_code}" >> "$RESULTS_FILE"
    fi
}

# Check if server is running
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Checking Server Health...${NC}"
echo -e "${BLUE}========================================${NC}"

health_check=$(curl -s -w "%{http_code}" "$BASE_URL/health" -o /dev/null)
if [ "$health_check" != "200" ]; then
    echo -e "${RED}ERROR: Server is not running at $BASE_URL${NC}"
    echo -e "${YELLOW}Please start the server with: npm start${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# ==========================================
# OFFICE TO PDF ROUTES (6 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Office to PDF Routes (6)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== OFFICE TO PDF ROUTES ===" >> "$RESULTS_FILE"

test_route "/api/v1/office-to-pdf/docx-to-pdf" "${TEST_DIR}/sample.docx" "docx-to-pdf.pdf"
test_route "/api/v1/office-to-pdf/xlsx-to-pdf" "${TEST_DIR}/sample.xlsx" "xlsx-to-pdf.pdf"
test_route "/api/v1/office-to-pdf/pptx-to-pdf" "${TEST_DIR}/sample.pptx" "pptx-to-pdf.pdf"
test_route "/api/v1/office-to-pdf/ods-to-pdf" "${TEST_DIR}/sample.ods" "ods-to-pdf.pdf"
test_route "/api/v1/office-to-pdf/odt-to-pdf" "${TEST_DIR}/sample.odt" "odt-to-pdf.pdf"
test_route "/api/v1/office-to-pdf/html-to-pdf" "${TEST_DIR}/sample.html" "html-to-pdf.pdf"

echo ""

# ==========================================
# OPEN DOCUMENTS ROUTES (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Open Documents Routes (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== OPEN DOCUMENTS ROUTES ===" >> "$RESULTS_FILE"

test_route "/api/v1/open-documents/docx-to-odt" "${TEST_DIR}/sample.docx" "docx-to-odt.odt"
test_route "/api/v1/open-documents/odt-to-docx" "${TEST_DIR}/sample.odt" "odt-to-docx.docx"
test_route "/api/v1/open-documents/xlsx-to-ods" "${TEST_DIR}/sample.xlsx" "xlsx-to-ods.ods"
test_route "/api/v1/open-documents/ods-to-xlsx" "${TEST_DIR}/sample.ods" "ods-to-xlsx.xlsx"

echo ""

# ==========================================
# STRUCTURED DATA ROUTES (9 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Structured Data Routes (9)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== STRUCTURED DATA ROUTES ===" >> "$RESULTS_FILE"

test_route "/api/v1/structured-data/json-to-xml" "${TEST_DIR}/sample.json" "json-to-xml.xml"
test_route "/api/v1/structured-data/xml-to-json" "${TEST_DIR}/sample.xml" "xml-to-json.json"
test_route "/api/v1/structured-data/json-to-csv" "${TEST_DIR}/sample.json" "json-to-csv.csv"
test_route "/api/v1/structured-data/csv-to-json" "${TEST_DIR}/sample.csv" "csv-to-json.json"
test_route "/api/v1/structured-data/xml-to-csv" "${TEST_DIR}/sample.xml" "xml-to-csv.csv"
test_route "/api/v1/structured-data/csv-to-xml" "${TEST_DIR}/sample.csv" "csv-to-xml.xml"
test_route "/api/v1/structured-data/xlsx-to-csv" "${TEST_DIR}/sample.xlsx" "xlsx-to-csv.csv"
test_route "/api/v1/structured-data/csv-to-xlsx" "${TEST_DIR}/sample.csv" "csv-to-xlsx.xlsx"
test_route "/api/v1/structured-data/json-to-xlsx" "${TEST_DIR}/sample.json" "json-to-xlsx.xlsx"

echo ""

# ==========================================
# TEXT & MARKDOWN ROUTES (5 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Text & Markdown Routes (5)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== TEXT & MARKDOWN ROUTES ===" >> "$RESULTS_FILE"

test_route "/api/v1/text-markdown/text-to-md" "${TEST_DIR}/sample.txt" "text-to-md.md"
test_route "/api/v1/text-markdown/md-to-text" "${TEST_DIR}/sample.md" "md-to-text.txt"
test_route "/api/v1/text-markdown/md-to-html" "${TEST_DIR}/sample.md" "md-to-html.html"
test_route "/api/v1/text-markdown/html-to-md" "${TEST_DIR}/sample.html" "html-to-md.md"
test_route "/api/v1/text-markdown/docx-to-md" "${TEST_DIR}/sample.docx" "docx-to-md.md"

echo ""

# ==========================================
# PDF TO OFFICE ROUTES (5 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing PDF to Office Routes (5)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== PDF TO OFFICE ROUTES ===" >> "$RESULTS_FILE"

test_route "/api/v1/pdf-to-office/pdf-to-text" "${TEST_DIR}/sample.pdf" "pdf-to-text.txt"
test_route "/api/v1/pdf-to-office/pdf-to-docx" "${TEST_DIR}/sample.pdf" "pdf-to-docx.docx"
test_route "/api/v1/pdf-to-office/pdf-to-xlsx" "${TEST_DIR}/sample.pdf" "pdf-to-xlsx.xlsx"
test_route "/api/v1/pdf-to-office/pdf-to-json" "${TEST_DIR}/sample.pdf" "pdf-to-json.json"
test_route "/api/v1/pdf-to-office/pdf-to-csv" "${TEST_DIR}/sample.pdf" "pdf-to-csv.csv"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - DOCX (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - DOCX (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - DOCX CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/docx-to-txt" "${TEST_DIR}/sample.docx" "comp-docx-to-txt.txt"
test_route "/api/v1/conversions/docx-to-html" "${TEST_DIR}/sample.docx" "comp-docx-to-html.html"
test_route "/api/v1/conversions/docx-to-pptx" "${TEST_DIR}/sample.docx" "comp-docx-to-pptx.pptx"
test_route "/api/v1/conversions/docx-to-xlsx" "${TEST_DIR}/sample.docx" "comp-docx-to-xlsx.xlsx"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - PPTX (3 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - PPTX (3)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - PPTX CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/pptx-to-txt" "${TEST_DIR}/sample.pptx" "comp-pptx-to-txt.txt"
test_route "/api/v1/conversions/pptx-to-html" "${TEST_DIR}/sample.pptx" "comp-pptx-to-html.html"
test_route "/api/v1/conversions/pptx-to-md" "${TEST_DIR}/sample.pptx" "comp-pptx-to-md.md"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - TXT (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - TXT (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - TXT CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/txt-to-docx" "${TEST_DIR}/sample.txt" "comp-txt-to-docx.docx"
test_route "/api/v1/conversions/txt-to-pdf" "${TEST_DIR}/sample.txt" "comp-txt-to-pdf.pdf"
test_route "/api/v1/conversions/txt-to-html" "${TEST_DIR}/sample.txt" "comp-txt-to-html.html"
test_route "/api/v1/conversions/txt-to-md" "${TEST_DIR}/sample.txt" "comp-txt-to-md.md"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - PDF (1 route)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - PDF (1)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - PDF CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/pdf-to-html" "${TEST_DIR}/sample.pdf" "comp-pdf-to-html.html"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - MARKDOWN (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - Markdown (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - MARKDOWN CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/md-to-pdf" "${TEST_DIR}/sample.md" "comp-md-to-pdf.pdf"
test_route "/api/v1/conversions/md-to-docx" "${TEST_DIR}/sample.md" "comp-md-to-docx.docx"
test_route "/api/v1/conversions/md-to-odt" "${TEST_DIR}/sample.md" "comp-md-to-odt.odt"
test_route "/api/v1/conversions/md-to-pptx" "${TEST_DIR}/sample.md" "comp-md-to-pptx.pptx"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - XLSX (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - XLSX (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - XLSX CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/xlsx-to-json" "${TEST_DIR}/sample.xlsx" "comp-xlsx-to-json.json"
test_route "/api/v1/conversions/xlsx-to-xml" "${TEST_DIR}/sample.xlsx" "comp-xlsx-to-xml.xml"
test_route "/api/v1/conversions/xlsx-to-html" "${TEST_DIR}/sample.xlsx" "comp-xlsx-to-html.html"
test_route "/api/v1/conversions/xlsx-to-txt" "${TEST_DIR}/sample.xlsx" "comp-xlsx-to-txt.txt"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - ODS (3 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - ODS (3)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - ODS CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/ods-to-csv" "${TEST_DIR}/sample.ods" "comp-ods-to-csv.csv"
test_route "/api/v1/conversions/ods-to-html" "${TEST_DIR}/sample.ods" "comp-ods-to-html.html"
test_route "/api/v1/conversions/ods-to-txt" "${TEST_DIR}/sample.ods" "comp-ods-to-txt.txt"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - ODT (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - ODT (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - ODT CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/odt-to-txt" "${TEST_DIR}/sample.odt" "comp-odt-to-txt.txt"
test_route "/api/v1/conversions/odt-to-html" "${TEST_DIR}/sample.odt" "comp-odt-to-html.html"
test_route "/api/v1/conversions/odt-to-md" "${TEST_DIR}/sample.odt" "comp-odt-to-md.md"
test_route "/api/v1/conversions/odt-to-pptx" "${TEST_DIR}/sample.odt" "comp-odt-to-pptx.pptx"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - CSV (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - CSV (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - CSV CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/csv-to-xml" "${TEST_DIR}/sample.csv" "comp-csv-to-xml.xml"
test_route "/api/v1/conversions/csv-to-html" "${TEST_DIR}/sample.csv" "comp-csv-to-html.html"
test_route "/api/v1/conversions/csv-to-pdf" "${TEST_DIR}/sample.csv" "comp-csv-to-pdf.pdf"
test_route "/api/v1/conversions/csv-to-txt" "${TEST_DIR}/sample.csv" "comp-csv-to-txt.txt"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - JSON (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - JSON (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - JSON CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/json-to-csv" "${TEST_DIR}/sample.json" "comp-json-to-csv.csv"
test_route "/api/v1/conversions/json-to-xlsx" "${TEST_DIR}/sample.json" "comp-json-to-xlsx.xlsx"
test_route "/api/v1/conversions/json-to-html" "${TEST_DIR}/sample.json" "comp-json-to-html.html"
test_route "/api/v1/conversions/json-to-md" "${TEST_DIR}/sample.json" "comp-json-to-md.md"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - XML (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - XML (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - XML CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/xml-to-csv" "${TEST_DIR}/sample.xml" "comp-xml-to-csv.csv"
test_route "/api/v1/conversions/xml-to-xlsx" "${TEST_DIR}/sample.xml" "comp-xml-to-xlsx.xlsx"
test_route "/api/v1/conversions/xml-to-html" "${TEST_DIR}/sample.xml" "comp-xml-to-html.html"
test_route "/api/v1/conversions/xml-to-pdf" "${TEST_DIR}/sample.xml" "comp-xml-to-pdf.pdf"

echo ""

# ==========================================
# COMPREHENSIVE CONVERSIONS - HTML (4 routes)
# ==========================================
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Comprehensive - HTML (4)${NC}"
echo -e "${BLUE}========================================${NC}"
echo "" >> "$RESULTS_FILE"
echo "=== COMPREHENSIVE - HTML CONVERSIONS ===" >> "$RESULTS_FILE"

test_route "/api/v1/conversions/html-to-docx" "${TEST_DIR}/sample.html" "comp-html-to-docx.docx"
test_route "/api/v1/conversions/html-to-txt" "${TEST_DIR}/sample.html" "comp-html-to-txt.txt"
test_route "/api/v1/conversions/html-to-xlsx" "${TEST_DIR}/sample.html" "comp-html-to-xlsx.xlsx"
test_route "/api/v1/conversions/html-to-csv" "${TEST_DIR}/sample.html" "comp-html-to-csv.csv"

echo ""

# ==========================================
# FINAL SUMMARY
# ==========================================
echo "" >> "$RESULTS_FILE"
echo "=======================================" >> "$RESULTS_FILE"
echo "FINAL SUMMARY" >> "$RESULTS_FILE"
echo "=======================================" >> "$RESULTS_FILE"
echo "Total Routes Tested: $TOTAL_ROUTES" >> "$RESULTS_FILE"
echo "Passed: $PASSED_ROUTES" >> "$RESULTS_FILE"
echo "Failed: $FAILED_ROUTES" >> "$RESULTS_FILE"
echo "Success Rate: $(awk "BEGIN {printf \"%.2f\", ($PASSED_ROUTES/$TOTAL_ROUTES)*100}")%" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}FINAL TEST SUMMARY${NC}"
echo -e "${BLUE}=======================================${NC}"
echo -e "Total Routes Tested: ${BLUE}$TOTAL_ROUTES${NC}"
echo -e "Passed: ${GREEN}$PASSED_ROUTES${NC}"
echo -e "Failed: ${RED}$FAILED_ROUTES${NC}"
echo -e "Success Rate: ${GREEN}$(awk "BEGIN {printf \"%.2f\", ($PASSED_ROUTES/$TOTAL_ROUTES)*100}")%${NC}"
echo ""

# Show failed tests if any
if [ $FAILED_ROUTES -gt 0 ]; then
    echo -e "${RED}=======================================${NC}"
    echo -e "${RED}FAILED TESTS:${NC}"
    echo -e "${RED}=======================================${NC}"
    echo "" >> "$RESULTS_FILE"
    echo "FAILED TESTS:" >> "$RESULTS_FILE"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}✗${NC} $test"
        echo "✗ $test" >> "$RESULTS_FILE"
    done
    echo ""
fi

echo -e "${BLUE}Results saved to: ${YELLOW}$RESULTS_FILE${NC}"
echo -e "${BLUE}Output files saved to: ${YELLOW}$OUTPUT_DIR/${NC}"
echo ""
