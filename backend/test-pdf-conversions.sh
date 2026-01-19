#!/bin/bash

# PDF Conversion Endpoints Test Script
# Tests all 5 PDF to Office conversion endpoints

set -e

BASE_URL="http://localhost:5000/api/v1/pdf-to-office"
TEST_PDF="test-files/test.pdf"
OUTPUT_DIR="test-outputs"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "================================="
echo "PDF Conversion Endpoints Testing"
echo "================================="
echo ""

# Function to test an endpoint
test_endpoint() {
    local endpoint=$1
    local output_file=$2
    local mode=${3:-""}
    
    echo -e "${BLUE}Testing: ${endpoint}${NC}"
    
    local url="$BASE_URL/$endpoint"
    if [ -n "$mode" ]; then
        url="${url}?mode=${mode}"
    fi
    
    if curl -s -f -X POST "$url" \
        -F "file=@$TEST_PDF" \
        -o "$OUTPUT_DIR/$output_file" 2>&1 | grep -q "error"; then
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    else
        if [ -f "$OUTPUT_DIR/$output_file" ] && [ -s "$OUTPUT_DIR/$output_file" ]; then
            local size=$(du -h "$OUTPUT_DIR/$output_file" | cut -f1)
            echo -e "${GREEN}✓ SUCCESS${NC} - Output: $output_file (Size: $size)"
            
            # Check for manifest if it exists
            local job_dir=$(find storage/outputs -type d -mmin -1 2>/dev/null | tail -1)
            if [ -n "$job_dir" ] && [ -f "$job_dir/manifest.json" ]; then
                echo "  Manifest: $job_dir/manifest.json"
                cat "$job_dir/manifest.json" | grep -E '"conversion"|"method"|"ocrUsed"|"duration"' | sed 's/^/  /'
            fi
            return 0
        else
            echo -e "${RED}✗ FAILED - Output file is empty or missing${NC}"
            return 1
        fi
    fi
    echo ""
}

# Check if server is running
echo "Checking server..."
if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${RED}Error: Backend server is not running on port 5000${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Check if test PDF exists
if [ ! -f "$TEST_PDF" ]; then
    echo -e "${RED}Error: Test PDF not found at $TEST_PDF${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Test PDF found${NC}"
echo ""

# Test each endpoint
FAILED=0
PASSED=0

echo "Starting tests..."
echo "================================="
echo ""

# 1. PDF to Text
if test_endpoint "pdf-to-text" "output.txt" "fast"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# 2. PDF to DOCX
if test_endpoint "pdf-to-docx" "output.docx"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# 3. PDF to XLSX
if test_endpoint "pdf-to-xlsx" "output.xlsx" "structured"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# 4. PDF to JSON
if test_endpoint "pdf-to-json" "output.json" "structured"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# 5. PDF to CSV
if test_endpoint "pdf-to-csv" "output.csv" "structured"; then
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Summary
echo "================================="
echo "Test Summary"
echo "================================="
echo -e "Passed: ${GREEN}$PASSED${NC}/5"
echo -e "Failed: ${RED}$FAILED${NC}/5"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    echo ""
    echo "Output files location: $OUTPUT_DIR/"
    ls -lh "$OUTPUT_DIR/"
    exit 0
else
    echo -e "${RED}Some tests failed ✗${NC}"
    exit 1
fi
