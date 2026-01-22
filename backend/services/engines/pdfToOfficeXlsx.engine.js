import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import  createJobWorkspace  from "../jobs/jobManager.js";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import * as cheerio from "cheerio";
import ExcelJS from "exceljs";
import logger from "../../utils/logger.js";

export const pdfToXlsxEngine = {
    async convert(inputFile, mode = 'structured') {
        const startTime = Date.now();
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        // Move uploaded file to working directory
        await fs.rename(inputFile.path, inputPath);

        let tablesFound = 0;
        let method = 'libreoffice-html';

        try {
            // Convert PDF to HTML using LibreOffice to extract table structures
            await this.convertPdfToHtml(inputPath, job.workingDir);

            // Read the HTML file
            const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + '.html');
            
            try {
                await fs.access(htmlPath);
            } catch (error) {
                throw new Error('HTML conversion failed. Unable to extract table data from PDF.');
            }

            const htmlContent = await fs.readFile(htmlPath, 'utf-8');
            const $ = cheerio.load(htmlContent);

            // Create Excel workbook
            const workbook = new ExcelJS.Workbook();
            
            // Extract tables from HTML
            const tables = $('table');
            
            if (tables.length === 0) {
                // No tables found, try to extract text as fallback
                console.log('No tables found in PDF, creating single sheet with extracted text');
                const sheet = workbook.addWorksheet('Content');
                const textContent = $('body').text().trim();
                
                if (textContent) {
                    const lines = textContent.split('\n').filter(line => line.trim());
                    lines.forEach((line, index) => {
                        sheet.addRow([line.trim()]);
                    });
                } else {
                    sheet.addRow(['No tabular data found in PDF']);
                    sheet.addRow(['The PDF may not contain tables or may require OCR processing']);
                }
                tablesFound = 0;
            } else {
                // Process each table
                tables.each((tableIndex, table) => {
                    const sheetName = `Table_${tableIndex + 1}`;
                    const sheet = workbook.addWorksheet(sheetName);
                    
                    const $table = $(table);
                    const rows = $table.find('tr');
                    
                    rows.each((rowIndex, row) => {
                        const cells = $(row).find('td, th');
                        const rowData = [];
                        
                        cells.each((cellIndex, cell) => {
                            rowData.push($(cell).text().trim());
                        });
                        
                        if (rowData.length > 0) {
                            sheet.addRow(rowData);
                        }
                    });
                    
                    // Style header row if exists
                    if (sheet.rowCount > 0) {
                        const headerRow = sheet.getRow(1);
                        headerRow.font = { bold: true };
                        headerRow.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFE0E0E0' }
                        };
                    }
                    
                    tablesFound++;
                });
            }

            // Write Excel file
            const outputFileName = path.parse(inputFile.originalname).name + '.xlsx';
            const outputPath = path.join(outputDir, outputFileName);
            await workbook.xlsx.writeFile(outputPath);

            // Get output file stats
            const outputStats = await fs.stat(outputPath);
            const endTime = Date.now();

            // Create manifest
            const manifest = {
                jobId: job.jobId,
                conversion: 'pdf-to-xlsx',
                input: {
                    filename: inputFile.originalname,
                    size: inputFile.size
                },
                output: {
                    filename: outputFileName,
                    size: outputStats.size,
                    sheets: workbook.worksheets.length
                },
                processing: {
                    method: method,
                    mode: mode,
                    tablesFound: tablesFound,
                    ocrUsed: false,
                    confidence: tablesFound > 0 ? 'medium' : 'low',
                    note: tablesFound === 0 ? 'No tables detected. Text content extracted as fallback.' : 'Tables extracted from PDF structure.',
                    duration: endTime - startTime,
                    timestamp: new Date().toISOString()
                },
                tools: {
                    node: process.version,
                    libreoffice: libreOfficeConfig.binary,
                    cheerio: 'latest',
                    exceljs: 'latest'
                }
            };

            // Cleanup working directory
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
            } catch (cleanupError) {
                logger.warn('Cleanup warning:', cleanupError);
            }

            return {
                outputPath,
                outputDir,
                manifest
            };

        } catch (error) {
            // Cleanup on error
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
                await fs.rm(outputDir, { recursive: true, force: true });
            } catch (cleanupError) {
                logger.warn('Cleanup error:', cleanupError);
            }
            throw new Error(`PDF to XLSX conversion failed: ${error.message}`);
        }
    },

    async convertPdfToHtml(inputPath, outputDir) {
        return new Promise((resolve, reject) => {
            const args = [
                ...libreOfficeConfig.baseArgs,
                "--convert-to",
                "html",
                "--outdir",
                outputDir,
                inputPath
            ];

            const process = spawn(libreOfficeConfig.binary, args);

            const timer = setTimeout(() => {
                process.kill("SIGKILL");
                reject(new Error("LibreOffice conversion timeout"));
            }, libreOfficeConfig.timeoutMs);

            process.on("exit", code => {
                clearTimeout(timer);
                code === 0 ? resolve() : reject(new Error(`LibreOffice failed with code ${code}`));
            });
        });
    }
};
