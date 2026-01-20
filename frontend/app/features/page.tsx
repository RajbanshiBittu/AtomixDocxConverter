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
    description: "Convert Excel spreadsheets to OpenDocument format."
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
  {
    icon: DocumentIcon,
    title: "html to pdf",
    description: "Convert HTML files to PDF format."
  },
  {    icon: DocumentIcon,
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
  {
    icon: DocumentIcon,
    title: "pdf to docx",
    description: "Convert PDF files to Word documents."
  },
  {
    icon: DocumentIcon,
    title: "pdf to text",
    description: "Convert PDF files to plain text."
  },
  {
    icon: DocumentIcon,
    title: "pdf to xlsx",
    description: "Convert PDF files to Excel spreadsheets."
  },
  {
    icon: DocumentIcon,
    title: "pdf to json",
    description: "Convert PDF files to JSON format."
  },
  {
    icon: DocumentIcon,
    title: "pdf to csv",
    description: "Convert PDF files to CSV format."
  },

  // // Docx Conversion
  {
    icon: DocumentIcon,
    title: "docx to txt",
    description: "Convert Word documents to plain text format."
  },
  {
    icon: DocumentIcon,
    title: "docx to html",
    description: "Convert Word documents to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "docx to pptx",
    description: "Convert Word documents to PowerPoint presentations."
  },
  {
    icon: DocumentIcon,
    title: "docx to xlsx",
    description: "Convert Word documents to Excel spreadsheets."
  },

  //     //PPTX Conversion
  {
    icon: DocumentIcon,
    title: "pptx to txt",
    description: "Convert PowerPoint presentations to plain text format."
  },
  {
    icon: DocumentIcon,
    title: "pptx to html",
    description: "Convert PowerPoint presentations to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "pptx to md",
    description: "Convert PowerPoint presentations to Markdown format."
  },

  //     //TXT Conversion
  {
    icon: DocumentIcon,
    title: "txt to docx",
    description: "Convert plain text files to Word document format."
  },
  {
    icon: DocumentIcon,
    title: "txt to pdf",
    description: "Convert plain text files to PDF format."
  },
  {
    icon: DocumentIcon,
    title: "txt to html",
    description: "Convert plain text files to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "txt to md",
    description: "Convert plain text files to Markdown format."
  },
  //     //PDF Conversion
  {
    icon: DocumentIcon,
    title: "pdf to html",
    description: "Convert PDF files to HTML format."
  },

  // Markdown Conversion
  {
    icon: DocumentIcon,
    title: "md to pdf",
    description: "Convert Markdown files to PDF format."
  },
  {
    icon: DocumentIcon,
    title: "md to docx",
    description: "Convert Markdown files to Word document format."
  },
  {
    icon: DocumentIcon,
    title: "md to odt",
    description: "Convert Markdown files to OpenDocument text format."
  },{
    icon: DocumentIcon,
    title: "md to pptx",
    description: "Convert Markdown files to PowerPoint presentations."
  },

  // XLSX Conversion
  {
    icon: DocumentIcon,
    title: "xlsx to json",
    description: "Convert Excel spreadsheets to JSON format."
  },
  {
    icon: DocumentIcon,
    title: "xlsx to xml",
    description: "Convert Excel spreadsheets to XML format."
  },{
    icon: DocumentIcon,
    title: "xlsx to html",
    description: "Convert Excel spreadsheets to HTML format."
  },{
    icon: DocumentIcon,
    title: "xlsx to txt",
    description: "Convert Excel spreadsheets to plain text format."
  },

  // ODS Conversion
  {
    icon: DocumentIcon,
    title: "ods to csv",
    description: "Convert OpenDocument spreadsheets to CSV format."
  },
  {
    icon: DocumentIcon,
    title: "ods to html",
    description: "Convert OpenDocument spreadsheets to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "ods to txt",
    description: "Convert OpenDocument spreadsheets to plain text format."
  },

  // ODT Conversion
  {
    icon: DocumentIcon,
    title: "odt to txt",
    description: "Convert OpenDocument text files to plain text format."
  },
  {
    icon: DocumentIcon,
    title: "odt to html",
    description: "Convert OpenDocument text files to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "odt to md",
    description: "Convert OpenDocument text files to Markdown format."
  },
  {
    icon: DocumentIcon,
    title: "odt to pptx",
    description: "Convert OpenDocument text files to PowerPoint presentations."
  },

  // CSV Conversion
  {
    icon: DocumentIcon,
    title: "csv to html",
    description: "Convert CSV files to HTML format."
  },{
    icon: DocumentIcon,
    title: "csv to pdf",
    description: "Convert CSV files to PDF format."
  },{
    icon: DocumentIcon,
    title: "csv to txt",
    description: "Convert CSV files to plain text format."
  },

  // JSON Conversion
  {
    icon: DocumentIcon,
    title: "json to html",
    description: "Convert JSON data to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "json to md",
    description: "Convert JSON data to Markdown format."
  },

  // XML Conversion
  {
    icon: DocumentIcon,
    title: "xml to xlsx",
    description: "Convert XML data to Excel format."
  },
  {
    icon: DocumentIcon,
    title: "xml to html",
    description: "Convert XML data to HTML format."
  },
  {
    icon: DocumentIcon,
    title: "xml to pdf",
    description: "Convert XML data to PDF format."
  },

  // HTML Conversion
  {
    icon: DocumentIcon,
    title: "html to docx",
    description: "Convert HTML files to Word document format."
  },
  {
    icon: DocumentIcon,
    title: "html to txt",
    description: "Convert HTML files to plain text format."
  },
  {
    icon: DocumentIcon,
    title: "html to xlsx",
    description: "Convert HTML files to Excel spreadsheet format."
  },
  {
    icon: DocumentIcon,
    title: "html to csv",
    description: "Convert HTML files to CSV format."
  }
];


export const Features = () => {
    const [showConversionPanel, setShowConversionPanel] = useState(false);
    const [selectedConversionType, setSelectedConversionType] = useState<string>('');
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    // Split features: first 35 and remaining 33
    const INITIAL_DISPLAY_COUNT = 35;
    const visibleFormats = showAllFeatures ? formats : formats.slice(0, INITIAL_DISPLAY_COUNT);
    const remainingCount = formats.length - INITIAL_DISPLAY_COUNT;

    const handleCardClick = (conversionType: string) => {
        setSelectedConversionType(conversionType);
        setShowConversionPanel(true);
        // Scroll to conversion panel after render
        setTimeout(() => {
            document.getElementById("convert")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const toggleShowMore = () => {
        setShowAllFeatures(!showAllFeatures);
        
        // If collapsing, scroll to the "More Features" button position
        if (showAllFeatures) {
            setTimeout(() => {
                const section = document.querySelector('section.py-15');
                if (section) {
                    const sectionRect = section.getBoundingClientRect();
                    const offset = window.pageYOffset + sectionRect.top;
                    window.scrollTo({ 
                        top: offset + 1200, // Approximate position of first 35 cards
                        behavior: 'smooth' 
                    });
                }
            }, 50);
        }
    };

    return (
        <>
            <section className="py-15 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Everything You Need to Convert Documents</h2>
                    <p className="mt-4 text-lg text-green-500">Convert files between multiple formats with accuracy, speed, and reliability — all in one place</p>
                  </div>
                    <div className="grid md:grid-cols-5 gap-6">
                        {visibleFormats.map(({ title, description, icon: Icon }) => (
                            <article
                                key={title}
                                onClick={() => handleCardClick(title)}
                                className="p-4 rounded-xl bg-white shadow hover:shadow-lg border border-gray-200 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                            >
                                <Icon className="h-7 w-7 text-green-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-2 text-black">{title}</h3>
                                <p className="text-sm text-gray-600">{description}</p>
                            </article>
                        ))}
                    </div>

                    {/* More Features / Show Less Button */}
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={toggleShowMore}
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                            aria-expanded={showAllFeatures}
                            aria-label={showAllFeatures ? "Show less features" : `Show ${remainingCount} more features`}
                        >
                            <span>
                                {showAllFeatures ? 'Show Less' : `More Features`}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${showAllFeatures ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
            
            {showConversionPanel && <ConversionPanel conversionType={selectedConversionType} />}
        </>
    )
}

export default Features;