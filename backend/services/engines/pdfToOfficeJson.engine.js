import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { createJobWorkspace } from "../jobs/jobManager.js";
import { libreOfficeConfig } from "../../config/libreOffice.config.js";
import * as cheerio from "cheerio";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule;

export const pdfToJsonEngine = {
    async convert(inputFile, mode = 'structured') {
        const startTime = Date.now();
        const job = await createJobWorkspace(inputFile.originalname);

        const inputPath = path.join(job.workingDir, inputFile.originalname);
        const outputDir = job.outputDir;

        // Move uploaded file to working directory
        await fs.rename(inputFile.path, inputPath);

        try {
            // Extract PDF metadata and text (try pdf-parse, fall back to LibreOffice HTML)
            const dataBuffer = await fs.readFile(inputPath);
            let pdfData = null;
            try {
                const parser = new pdfParse({ data: dataBuffer });
                const result = await parser.getText();
                pdfData = {
                    text: result.text,
                    numpages: result.pages,
                    info: result.info || {}
                };
            } catch (parseError) {
                console.warn('pdf-parse failed, falling back to LibreOffice HTML:', parseError.message || parseError);
                // create a minimal pdfData structure so downstream code can continue
                pdfData = { text: '', numpages: 0, info: {} };
            }

            // Convert PDF to HTML to extract structure (used for tables/blocks)
            await this.convertPdfToHtml(inputPath, job.workingDir);
            const htmlPath = path.join(job.workingDir, path.parse(inputFile.originalname).name + '.html');
            
            let structuredData = {
                metadata: {},
                pages: [],
                tables: [],
                images: []
            };

            try {
                await fs.access(htmlPath);
                const htmlContent = await fs.readFile(htmlPath, 'utf-8');
                const $ = cheerio.load(htmlContent);

                // Extract tables
                const tables = $('table');
                tables.each((tableIndex, table) => {
                    const $table = $(table);
                    const rows = [];
                    
                    $table.find('tr').each((rowIndex, row) => {
                        const cells = [];
                        $(row).find('td, th').each((cellIndex, cell) => {
                            cells.push($(cell).text().trim());
                        });
                        if (cells.length > 0) {
                            rows.push(cells);
                        }
                    });
                    
                    if (rows.length > 0) {
                        structuredData.tables.push({
                            tableId: tableIndex + 1,
                            rows: rows,
                            rowCount: rows.length,
                            columnCount: rows[0]?.length || 0
                        });
                    }
                });

                // Extract text blocks
                const paragraphs = $('p');
                const textBlocks = [];
                paragraphs.each((index, para) => {
                    const text = $(para).text().trim();
                    if (text.length > 0) {
                        textBlocks.push({
                            blockId: index + 1,
                            text: text,
                            length: text.length
                        });
                    }
                });

                // Organize by pages (simplified - LibreOffice doesn't preserve page boundaries well)
                structuredData.pages.push({
                    page: 1,
                    blocks: textBlocks,
                    tables: structuredData.tables
                });

            } catch (htmlError) {
                console.warn('HTML parsing failed, using fallback:', htmlError.message);
            }

            // Add metadata
            structuredData.metadata = {
                filename: inputFile.originalname,
                fileSize: inputFile.size,
                pageCount: pdfData.numpages,
                title: pdfData.info?.Title || '',
                author: pdfData.info?.Author || '',
                creator: pdfData.info?.Creator || '',
                producer: pdfData.info?.Producer || '',
                creationDate: pdfData.info?.CreationDate || '',
                modificationDate: pdfData.info?.ModDate || '',
                textLength: pdfData.text?.length || 0
            };

            // Create comprehensive JSON structure
            const jsonOutput = {
                document: structuredData.metadata,
                content: {
                    pages: structuredData.pages,
                    totalTables: structuredData.tables.length,
                    totalTextBlocks: structuredData.pages.reduce((sum, page) => sum + page.blocks.length, 0)
                },
                extraction: {
                    method: 'pdf-parse + libreoffice-html',
                    mode: mode,
                    ocrUsed: false,
                    timestamp: new Date().toISOString()
                }
            };

            // Write JSON file
            const outputFileName = path.parse(inputFile.originalname).name + '.json';
            const outputPath = path.join(outputDir, outputFileName);
            await fs.writeFile(outputPath, JSON.stringify(jsonOutput, null, 2), 'utf-8');

            // Get output file stats
            const outputStats = await fs.stat(outputPath);
            const endTime = Date.now();

            // Create manifest
            const manifest = {
                jobId: job.jobId,
                conversion: 'pdf-to-json',
                input: {
                    filename: inputFile.originalname,
                    size: inputFile.size
                },
                output: {
                    filename: outputFileName,
                    size: outputStats.size
                },
                processing: {
                    method: 'pdf-parse + libreoffice-html',
                    mode: mode,
                    pagesProcessed: pdfData.numpages,
                    tablesFound: structuredData.tables.length,
                    ocrUsed: false,
                    duration: endTime - startTime,
                    timestamp: new Date().toISOString()
                },
                tools: {
                    node: process.version,
                    pdfParse: 'latest',
                    cheerio: 'latest',
                    libreoffice: libreOfficeConfig.binary
                }
            };

            // Cleanup working directory
            try {
                await fs.rm(job.workingDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.warn('Cleanup warning:', cleanupError);
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
                console.warn('Cleanup error:', cleanupError);
            }
            throw new Error(`PDF to JSON conversion failed: ${error.message}`);
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
