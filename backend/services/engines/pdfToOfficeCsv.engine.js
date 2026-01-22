import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import  createJobWorkspace  from "../jobs/jobManager.js";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import * as cheerio from "cheerio";

export const pdfToCsvEngine = {
    async convert(inputFile, mode = 'structured') {
        const startTime = Date.now();
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        // Move uploaded file to working directory
        await fs.rename(inputFile.path, inputPath);

        let tablesFound = 0;
        let method = 'libreoffice-html';
        const csvFiles = [];

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

            // Extract tables from HTML
            const tables = $('table');
            
            if (tables.length === 0) {
                // No tables found, create CSV from text content
                // console.log('No tables found in PDF, creating CSV from text content');
                const outputFileName = path.parse(inputFile.originalname).name + '.csv';
                const outputPath = path.join(outputDir, outputFileName);
                
                const textContent = $('body').text().trim();
                const lines = textContent.split('\n').filter(line => line.trim());
                
                // Write as single-column CSV
                const csvContent = ['Content\n', ...lines.map(line => `"${line.trim().replace(/"/g, '""')}"\n`)].join('');
                await fs.writeFile(outputPath, csvContent, 'utf-8');
                
                csvFiles.push({
                    filename: outputFileName,
                    path: outputPath,
                    rows: lines.length,
                    source: 'text-content'
                });
                
                tablesFound = 0;
            } else {
                // Process each table into a separate CSV or combine them
                const allTableData = [];
                
                tables.each((tableIndex, table) => {
                    const $table = $(table);
                    const tableData = [];
                    
                    $table.find('tr').each((rowIndex, row) => {
                        const cells = [];
                        $(row).find('td, th').each((cellIndex, cell) => {
                            cells.push($(cell).text().trim());
                        });
                        if (cells.length > 0) {
                            tableData.push(cells);
                        }
                    });
                    
                    if (tableData.length > 0) {
                        allTableData.push({
                            tableIndex: tableIndex + 1,
                            data: tableData
                        });
                    }
                });

                // Strategy: Combine all tables into one CSV with table markers
                if (allTableData.length > 0) {
                    const outputFileName = path.parse(inputFile.originalname).name + '.csv';
                    const outputPath = path.join(outputDir, outputFileName);
                    
                    let csvContent = '';
                    
                    for (const table of allTableData) {
                        // Add table header
                        if (allTableData.length > 1) {
                            csvContent += `\n"=== Table ${table.tableIndex} ==="\n`;
                        }
                        
                        // Add table rows
                        for (const row of table.data) {
                            const escapedRow = row.map(cell => `"${cell.replace(/"/g, '""')}"`);
                            csvContent += escapedRow.join(',') + '\n';
                        }
                        
                        tablesFound++;
                    }
                    
                    await fs.writeFile(outputPath, csvContent, 'utf-8');
                    
                    csvFiles.push({
                        filename: outputFileName,
                        path: outputPath,
                        tables: tablesFound,
                        source: 'html-tables'
                    });
                }
            }

            if (csvFiles.length === 0) {
                throw new Error('No data extracted from PDF');
            }

            // Use the first (or only) CSV file as primary output
            const primaryOutput = csvFiles[0];
            const outputStats = await fs.stat(primaryOutput.path);
            const endTime = Date.now();

            // Create manifest
            const manifest = {
                jobId: job.jobId,
                conversion: 'pdf-to-csv',
                input: {
                    filename: inputFile.originalname,
                    size: inputFile.size
                },
                output: {
                    filename: primaryOutput.filename,
                    size: outputStats.size,
                    files: csvFiles.map(f => ({ 
                        filename: f.filename, 
                        source: f.source,
                        tables: f.tables || 0,
                        rows: f.rows || 0
                    }))
                },
                processing: {
                    method: method,
                    mode: mode,
                    tablesFound: tablesFound,
                    ocrUsed: false,
                    confidence: tablesFound > 0 ? 'medium' : 'low',
                    note: tablesFound === 0 ? 'No tables detected. Text content extracted as single-column CSV.' : `${tablesFound} table(s) extracted and combined into CSV.`,
                    duration: endTime - startTime,
                    timestamp: new Date().toISOString()
                },
                tools: {
                    node: process.version,
                    libreoffice: libreOfficeConfig.binary,
                    cheerio: 'latest',
                    csvWriter: 'latest'
                }
            };

            // Cleanup working directory
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.warn('Cleanup warning:', cleanupError);
            }

            return {
                outputPath: primaryOutput.path,
                outputDir,
                manifest
            };

        } catch (error) {
            // Cleanup on error
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
                await fs.rm(outputDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.warn('Cleanup error:', cleanupError);
            }
            throw new Error(`PDF to CSV conversion failed: ${error.message}`);
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
