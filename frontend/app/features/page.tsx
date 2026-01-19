'use client';

import { useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import ConversionPanel from "@/components/ConversionPanel";

const formats = [
  // Office to PDF conversions
  {
    icon: DocumentIcon,
    title: "xlsx to pdf",
    description: "Convert Excel spreadsheets to PDF with formatting preserved."
  },
  {
    icon: DocumentIcon,
    title: "docx to pdf",
    description: "Convert Word documents to PDF maintaining layout."
  },
  {
    icon: DocumentIcon,
    title: "pptx to pdf",
    description: "Convert PowerPoint presentations to PDF format."
  },
  {
    icon: DocumentIcon,
    title: "odt to pdf",
    description: "Convert OpenDocument text files to PDF."
  },
  {
    icon: DocumentIcon,
    title: "ods to pdf",
    description: "Convert OpenDocument spreadsheets to PDF."
  },
  
  // Open Document conversions
  {
    icon: DocumentIcon,
    title: "docx to odt",
    description: "Convert Word documents to OpenDocument format."
  },
  {
    icon: DocumentIcon,
    title: "odt to docx",
    description: "Convert OpenDocument text to Word format."
  },
  {
    icon: DocumentIcon,
    title: "xlsx to ods",
    description: "Convert Excel to OpenDocument spreadsheet."
  },
  {
    icon: DocumentIcon,
    title: "ods to xlsx",
    description: "Convert OpenDocument spreadsheet to Excel."
  },
  
  // Structured Data conversions
  {
    icon: DocumentIcon,
    title: "csv to json",
    description: "Convert CSV data to JSON format."
  },
  {
    icon: DocumentIcon,
    title: "json to csv",
    description: "Convert JSON data to CSV format."
  },
  {
    icon: DocumentIcon,
    title: "csv to xml",
    description: "Convert CSV data to XML format."
  },
  {
    icon: DocumentIcon,
    title: "xml to csv",
    description: "Convert XML data to CSV format."
  },
  {
    icon: DocumentIcon,
    title: "json to xml",
    description: "Convert JSON data to XML format."
  },
  {
    icon: DocumentIcon,
    title: "xml to json",
    description: "Convert XML data to JSON format."
  },
  
  // Text/Markdown conversions
  {
    icon: DocumentIcon,
    title: "text to md",
    description: "Convert plain text to Markdown format."
  },
  {
    icon: DocumentIcon,
    title: "md to text",
    description: "Convert Markdown to plain text."
  },
  {
    icon: DocumentIcon,
    title: "md to html",
    description: "Convert Markdown to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "html to md",
    description: "Convert HTML to Markdown format."
  },
  {
    icon: DocumentIcon,
    title: "docx to md",
    description: "Convert Word documents to Markdown format."
  },
  
  // HTML to PDF conversion
  {
    icon: DocumentIcon,
    title: "html to pdf",
    description: "Convert HTML files to PDF format."
  },
  
  // Spreadsheet conversions
  {
    icon: DocumentIcon,
    title: "xlsx to csv",
    description: "Convert Excel spreadsheets to CSV format."
  },
  {
    icon: DocumentIcon,
    title: "csv to xlsx",
    description: "Convert CSV files to Excel format."
  },
  {
    icon: DocumentIcon,
    title: "json to xlsx",
    description: "Convert JSON data to Excel format."
  },
];


export const Features = () => {
    const [showConversionPanel, setShowConversionPanel] = useState(false);
    const [selectedConversionType, setSelectedConversionType] = useState<string>('');

    const handleCardClick = (conversionType: string) => {
        setSelectedConversionType(conversionType);
        setShowConversionPanel(true);
        // Scroll to conversion panel after render
        setTimeout(() => {
            document.getElementById("convert")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <>
            <section className="py-15 bg-gray-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-4">
                    {formats.map(({ title, description, icon: Icon }) => (
                        <article
                        key={title}
                        onClick={() => handleCardClick(title)}
                        className="p-6 rounded-xl bg-white shadow hover:shadow-lg transition cursor-pointer">
                            <Icon className="h-10 w-10 text-green-600 mb-4" />

                            <h3 className="font-semibold text-lg mb-2 text-black">{title}</h3>

                            <p className="text-sm text-gray-600">{description}</p>
                        </article>
                    ))}
                </div>
            </section>
            
            {showConversionPanel && <ConversionPanel conversionType={selectedConversionType} />}
        </>
    )
}

// Default export for Next.js page
export default Features;