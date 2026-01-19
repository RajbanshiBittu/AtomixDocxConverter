import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { Readable } from 'stream';

/**
 * Minimal PPTX Generator
 * Creates a basic PPTX file with text content slides
 * Uses OpenXML format specification
 */
export const minimalPptxGenerator = {
    /**
     * Create a minimal PPTX file from text content
     * @param {string} textContent - The text content to include
     * @param {string} title - Title for the presentation
     * @param {string} outputPath - Path where PPTX should be saved
     */
    async createFromText(textContent, title, outputPath) {
        // Split content into slides (by paragraphs or sections)
        const slides = this.splitIntoSlides(textContent, title);
        
        // Create PPTX structure
        await this.generatePptx(slides, outputPath);
        
        return { outputPath };
    },

    /**
     * Split text content into slides
     * Each slide contains max 500 characters or logical sections
     */
    splitIntoSlides(content, title) {
        const slides = [];
        
        // Title slide
        slides.push({
            title: title || 'Presentation',
            content: 'Generated from document conversion'
        });

        // Split content by double newlines (paragraphs)
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
        
        // Group paragraphs into slides (max 500 chars per slide)
        let currentSlide = '';
        let slideNumber = 1;
        
        for (const para of paragraphs) {
            const trimmed = para.trim();
            if (trimmed.length === 0) continue;
            
            if (currentSlide.length + trimmed.length > 500 && currentSlide.length > 0) {
                // Save current slide
                slides.push({
                    title: `Slide ${slideNumber}`,
                    content: currentSlide.trim()
                });
                slideNumber++;
                currentSlide = trimmed + '\n\n';
            } else {
                currentSlide += trimmed + '\n\n';
            }
        }
        
        // Add remaining content
        if (currentSlide.trim().length > 0) {
            slides.push({
                title: `Slide ${slideNumber}`,
                content: currentSlide.trim()
            });
        }
        
        // If no content slides, add a placeholder
        if (slides.length === 1) {
            slides.push({
                title: 'Content',
                content: content.substring(0, 1000) || 'No content available'
            });
        }
        
        return slides;
    },

    /**
     * Generate minimal PPTX file structure
     */
    async generatePptx(slides, outputPath) {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = await fs.open(outputPath, 'w');
        const writeStream = output.createWriteStream();

        return new Promise((resolve, reject) => {
            writeStream.on('close', async () => {
                await output.close();
                resolve();
            });
            writeStream.on('error', reject);
            archive.on('error', reject);

            archive.pipe(writeStream);

            // Add required PPTX structure
            archive.append(this.getContentTypes(slides.length), { name: '[Content_Types].xml' });
            archive.append(this.getRelsXml(), { name: '_rels/.rels' });
            archive.append(this.getPresentationRels(slides.length), { name: 'ppt/_rels/presentation.xml.rels' });
            archive.append(this.getPresentationXml(slides.length), { name: 'ppt/presentation.xml' });

            // Add slides
            slides.forEach((slide, index) => {
                archive.append(this.getSlideXml(slide, index + 1), { name: `ppt/slides/slide${index + 1}.xml` });
                archive.append(this.getSlideRels(index + 1), { name: `ppt/slides/_rels/slide${index + 1}.xml.rels` });
            });

            archive.finalize();
        });
    },

    getContentTypes(slideCount) {
        let slideParts = '';
        for (let i = 1; i <= slideCount; i++) {
            slideParts += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
        }
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
${slideParts}
</Types>`;
    },

    getRelsXml() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
    },

    getPresentationRels(slideCount) {
        let slideRels = '';
        for (let i = 1; i <= slideCount; i++) {
            slideRels += `<Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
        }
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${slideRels}
</Relationships>`;
    },

    getPresentationXml(slideCount) {
        let slideIds = '';
        for (let i = 1; i <= slideCount; i++) {
            slideIds += `<p:sldId id="${255 + i}" r:id="rId${i}"/>`;
        }
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:sldIdLst>
${slideIds}
</p:sldIdLst>
<p:sldSz cx="9144000" cy="6858000"/>
<p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;
    },

    getSlideRels(slideNum) {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
    },

    getSlideXml(slide, slideNum) {
        const titleText = this.escapeXml(slide.title);
        const contentText = this.escapeXml(slide.content);
        
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld>
<p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
<p:sp>
<p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" y="274638"/><a:ext cx="8229600" cy="1143000"/></a:xfrm></p:spPr>
<p:txBody>
<a:bodyPr/>
<a:lstStyle/>
<a:p><a:r><a:rPr lang="en-US" sz="4400" b="1"/><a:t>${titleText}</a:t></a:r></a:p>
</p:txBody>
</p:sp>
<p:sp>
<p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>
<p:spPr><a:xfrm><a:off x="457200" y="1600200"/><a:ext cx="8229600" cy="4525963"/></a:xfrm></p:spPr>
<p:txBody>
<a:bodyPr/>
<a:lstStyle/>
<a:p><a:r><a:rPr lang="en-US" sz="2400"/><a:t>${contentText}</a:t></a:r></a:p>
</p:txBody>
</p:sp>
</p:spTree>
</p:cSld>
</p:sld>`;
    },

    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
};
