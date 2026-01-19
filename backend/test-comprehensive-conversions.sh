#!/bin/bash

# Comprehensive Conversion Testing Script
# Tests all 43 new conversions

echo "================================================"
echo "Testing 43 New Document Conversions"
echo "================================================"
echo ""

BASE_URL="http://localhost:5050/api/v1/conversions"
TEST_DIR="test-files"
OUTPUT_DIR="test-outputs-comprehensive"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Counter for successful tests
SUCCESS_COUNT=0
TOTAL_TESTS=43

echo "📝 Note: This script requires test files in the '$TEST_DIR' directory"
echo "   Create sample files with appropriate extensions for testing"
echo ""

# Function to test a conversion
test_conversion() {
    local endpoint=$1
    local input_file=$2
    local output_ext=$3
    local test_name=$4
    
    echo "Testing: $test_name"
    echo "  Endpoint: $endpoint"
    echo "  Input: $input_file"
    
    if [ ! -f "$TEST_DIR/$input_file" ]; then
        echo "  ⚠️  SKIPPED: Input file not found"
        echo ""
        return 1
    fi
    
    local output_file="$OUTPUT_DIR/${test_name}.$output_ext"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/$endpoint" \
        -F "file=@$TEST_DIR/$input_file" \
        -o "$output_file" 2>&1)
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ]; then
        echo "  ✅ SUCCESS (HTTP 200)"
        ((SUCCESS_COUNT++))
    else
        echo "  ❌ FAILED (HTTP $http_code)"
    fi
    echo ""
}

echo "================================================"
echo "DOCX CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "docx-to-txt" "sample.docx" "txt" "docx-to-txt"
test_conversion "docx-to-html" "sample.docx" "html" "docx-to-html"
test_conversion "docx-to-pptx" "sample.docx" "pptx" "docx-to-pptx"
test_conversion "docx-to-xlsx" "sample.docx" "xlsx" "docx-to-xlsx"

echo "================================================"
echo "PPTX CONVERSIONS (3 tests)"
echo "================================================"
test_conversion "pptx-to-txt" "sample.pptx" "txt" "pptx-to-txt"
test_conversion "pptx-to-html" "sample.pptx" "html" "pptx-to-html"
test_conversion "pptx-to-md" "sample.pptx" "md" "pptx-to-md"

echo "================================================"
echo "TXT CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "txt-to-docx" "sample.txt" "docx" "txt-to-docx"
test_conversion "txt-to-pdf" "sample.txt" "pdf" "txt-to-pdf"
test_conversion "txt-to-html" "sample.txt" "html" "txt-to-html"
test_conversion "txt-to-md" "sample.txt" "md" "txt-to-md"

echo "================================================"
echo "PDF CONVERSIONS (1 test)"
echo "================================================"
test_conversion "pdf-to-html" "sample.pdf" "html" "pdf-to-html"

echo "================================================"
echo "MARKDOWN CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "md-to-pdf" "sample.md" "pdf" "md-to-pdf"
test_conversion "md-to-docx" "sample.md" "docx" "md-to-docx"
test_conversion "md-to-odt" "sample.md" "odt" "md-to-odt"
test_conversion "md-to-pptx" "sample.md" "pptx" "md-to-pptx"

echo "================================================"
echo "XLSX CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "xlsx-to-json" "sample.xlsx" "json" "xlsx-to-json"
test_conversion "xlsx-to-xml" "sample.xlsx" "xml" "xlsx-to-xml"
test_conversion "xlsx-to-html" "sample.xlsx" "html" "xlsx-to-html"
test_conversion "xlsx-to-txt" "sample.xlsx" "txt" "xlsx-to-txt"

echo "================================================"
echo "ODS CONVERSIONS (3 tests)"
echo "================================================"
test_conversion "ods-to-csv" "sample.ods" "csv" "ods-to-csv"
test_conversion "ods-to-html" "sample.ods" "html" "ods-to-html"
test_conversion "ods-to-txt" "sample.ods" "txt" "ods-to-txt"

echo "================================================"
echo "ODT CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "odt-to-txt" "sample.odt" "txt" "odt-to-txt"
test_conversion "odt-to-html" "sample.odt" "html" "odt-to-html"
test_conversion "odt-to-md" "sample.odt" "md" "odt-to-md"
test_conversion "odt-to-pptx" "sample.odt" "pptx" "odt-to-pptx"

echo "================================================"
echo "CSV CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "csv-to-xml" "sample.csv" "xml" "csv-to-xml"
test_conversion "csv-to-html" "sample.csv" "html" "csv-to-html"
test_conversion "csv-to-pdf" "sample.csv" "pdf" "csv-to-pdf"
test_conversion "csv-to-txt" "sample.csv" "txt" "csv-to-txt"

echo "================================================"
echo "JSON CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "json-to-csv" "sample.json" "csv" "json-to-csv"
test_conversion "json-to-xlsx" "sample.json" "xlsx" "json-to-xlsx"
test_conversion "json-to-html" "sample.json" "html" "json-to-html"
test_conversion "json-to-md" "sample.json" "md" "json-to-md"

echo "================================================"
echo "XML CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "xml-to-csv" "sample.xml" "csv" "xml-to-csv"
test_conversion "xml-to-xlsx" "sample.xml" "xlsx" "xml-to-xlsx"
test_conversion "xml-to-html" "sample.xml" "html" "xml-to-html"
test_conversion "xml-to-pdf" "sample.xml" "pdf" "xml-to-pdf"

echo "================================================"
echo "HTML CONVERSIONS (4 tests)"
echo "================================================"
test_conversion "html-to-docx" "sample.html" "docx" "html-to-docx"
test_conversion "html-to-txt" "sample.html" "txt" "html-to-txt"
test_conversion "html-to-xlsx" "sample.html" "xlsx" "html-to-xlsx"
test_conversion "html-to-csv" "sample.html" "csv" "html-to-csv"

echo "================================================"
echo "TEST SUMMARY"
echo "================================================"
echo "Total Tests: $TOTAL_TESTS"
echo "Successful: $SUCCESS_COUNT"
echo "Failed/Skipped: $((TOTAL_TESTS - SUCCESS_COUNT))"
echo ""
echo "Success Rate: $((SUCCESS_COUNT * 100 / TOTAL_TESTS))%"
echo ""
echo "Output files saved to: $OUTPUT_DIR/"
echo "================================================"
