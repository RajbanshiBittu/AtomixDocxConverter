// components/ConversionPanel.tsx
'use client';

import { useState } from 'react';

interface ConversionPanelProps {
  conversionType?: string;
}

export default function ConversionPanel({ conversionType = "docx to pdf" }: ConversionPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ blob: Blob; filename: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setConvertedFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setConvertedFile(null);
    }
  };

  const getApiEndpoint = (type: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1';
    
    // Map conversion type to API endpoint
    const endpointMap: { [key: string]: string } = {
      // Office to PDF
      'docx to pdf': `${baseUrl}/office-to-pdf/docx-to-pdf`,
      'xlsx to pdf': `${baseUrl}/office-to-pdf/xlsx-to-pdf`,
      'pptx to pdf': `${baseUrl}/office-to-pdf/pptx-to-pdf`,
      'odt to pdf': `${baseUrl}/office-to-pdf/odt-to-pdf`,
      'ods to pdf': `${baseUrl}/office-to-pdf/ods-to-pdf`,
      
      // Open Documents
      'docx to odt': `${baseUrl}/open-documents/docx-to-odt`,
      'odt to docx': `${baseUrl}/open-documents/odt-to-docx`,
      'xlsx to ods': `${baseUrl}/open-documents/xlsx-to-ods`,
      'ods to xlsx': `${baseUrl}/open-documents/ods-to-xlsx`,
      
      // Structured Data
      'json to xml': `${baseUrl}/structured-data/json-to-xml`,
      'xml to json': `${baseUrl}/structured-data/xml-to-json`,
      'json to csv': `${baseUrl}/structured-data/json-to-csv`,
      'csv to json': `${baseUrl}/structured-data/csv-to-json`,
      'xml to csv': `${baseUrl}/structured-data/xml-to-csv`,
      'csv to xml': `${baseUrl}/structured-data/csv-to-xml`,
      
      // Text/Markdown
      'text to md': `${baseUrl}/text-markdown/text-to-md`,
      'md to text': `${baseUrl}/text-markdown/md-to-text`,
      'md to html': `${baseUrl}/text-markdown/md-to-html`,
      'html to md': `${baseUrl}/text-markdown/html-to-md`,
      'docx to md': `${baseUrl}/text-markdown/docx-to-md`,
      
      // HTML to PDF
      'html to pdf': `${baseUrl}/office-to-pdf/html-to-pdf`,
      
      // Spreadsheet conversions
      'xlsx to csv': `${baseUrl}/structured-data/xlsx-to-csv`,
      'csv to xlsx': `${baseUrl}/structured-data/csv-to-xlsx`,
      'json to xlsx': `${baseUrl}/structured-data/json-to-xlsx`,

      //PDF to Office
      'pdf to docx': `${baseUrl}/pdf-to-office/pdf-to-docx`,
      'pdf to text': `${baseUrl}/pdf-to-office/pdf-to-text`,
      'pdf to xlsx': `${baseUrl}/pdf-to-office/pdf-to-xlsx`,
      'pdf to json': `${baseUrl}/pdf-to-office/pdf-to-json`,
      'pdf to csv': `${baseUrl}/pdf-to-office/pdf-to-csv`,

      // Docx Conversion
      'docx to txt': `${baseUrl}/comprehensive-conversion/docx-to-txt`,
      'docx to html': `${baseUrl}/comprehensive-conversion/docx-to-html`,
      'docx to pptx': `${baseUrl}/comprehensive-conversion/docx-to-pptx`,
      'docx to xlsx': `${baseUrl}/comprehensive-conversion/docx-to-xlsx`, 

      //PPTX Conversion
      'pptx to txt': `${baseUrl}/comprehensive-conversion/pptx-to-txt`,
      'pptx to html': `${baseUrl}/comprehensive-conversion/pptx-to-html`,
      'pptx to md': `${baseUrl}/comprehensive-conversion/pptx-to-md`,

      //TXT Conversion
      'txt to docx': `${baseUrl}/comprehensive-conversion/txt-to-docx`,
      'txt to pdf': `${baseUrl}/comprehensive-conversion/txt-to-pdf`,
      'txt to html': `${baseUrl}/comprehensive-conversion/txt-to-html`,
      'txt to md': `${baseUrl}/comprehensive-conversion/txt-to-md`,

      //PDF Conversion
      'pdf to html': `${baseUrl}/comprehensive-conversion/pdf-to-html`,

      // Markdown Conversion
      'md to pdf': `${baseUrl}/comprehensive-conversion/md-to-pdf`,
      'md to docx': `${baseUrl}/comprehensive-conversion/md-to-docx`,
      'md to odt': `${baseUrl}/comprehensive-conversion/md-to-odt`,
      'md to pptx': `${baseUrl}/comprehensive-conversion/md-to-pptx`,

      // XLSX Conversion
      'xlsx to json': `${baseUrl}/comprehensive-conversion/xlsx-to-json`,
      'xlsx to xml': `${baseUrl}/comprehensive-conversion/xlsx-to-xml`,
      'xlsx to html': `${baseUrl}/comprehensive-conversion/xlsx-to-html`,
      'xlsx to txt': `${baseUrl}/comprehensive-conversion/xlsx-to-txt`, 

      // ODS Conversion
      'ods to csv': `${baseUrl}/comprehensive-conversion/ods-to-csv`,
      'ods to html': `${baseUrl}/comprehensive-conversion/ods-to-html`,
      'ods to txt': `${baseUrl}/comprehensive-conversion/ods-to-txt`, 

      // ODT Conversion
      'odt to txt': `${baseUrl}/comprehensive-conversion/odt-to-txt`,
      'odt to html': `${baseUrl}/comprehensive-conversion/odt-to-html`,
      'odt to md': `${baseUrl}/comprehensive-conversion/odt-to-md`,
      'odt to pptx': `${baseUrl}/comprehensive-conversion/odt-to-pptx`,

      // CSV Conversion
      'csv-to-xml': `${baseUrl}/comprehensive-conversion/csv-to-xml`,
      'csv-to-html': `${baseUrl}/comprehensive-conversion/csv-to-html`,
      'csv-to-pdf': `${baseUrl}/comprehensive-conversion/csv-to-pdf`,
      'csv-to-txt': `${baseUrl}/comprehensive-conversion/csv-to-txt`,

      // JSON Conversion
      'json-to-csv': `${baseUrl}/comprehensive-conversion/json-to-csv`,
      'json-to-xlsx': `${baseUrl}/comprehensive-conversion/json-to-xlsx`,
      'json-to-html': `${baseUrl}/comprehensive-conversion/json-to-html`,
      'json-to-md': `${baseUrl}/comprehensive-conversion/json-to-md`,

      // XML Conversion
      'xml-to-csv': `${baseUrl}/comprehensive-conversion/xml-to-csv`,
      'xml-to-xlsx': `${baseUrl}/comprehensive-conversion/xml-to-xlsx`,
      'xml-to-html': `${baseUrl}/comprehensive-conversion/xml-to-html`,
      'xml-to-pdf': `${baseUrl}/comprehensive-conversion/xml-to-pdf`,

      // HTML Conversion
      'html to docx': `${baseUrl}/comprehensive-conversion/html-to-docx`,
      'html to txt': `${baseUrl}/comprehensive-conversion/html-to-txt`,
      'html to xlsx': `${baseUrl}/comprehensive-conversion/html-to-xlsx`,
      'html to csv': `${baseUrl}/comprehensive-conversion/html-to-csv`,

    };
    
    return endpointMap[type.toLowerCase()] || endpointMap['docx to pdf'];
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setConverting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = getApiEndpoint(conversionType);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to parse JSON error from backend
        try {
          const errorData = await response.json();
          throw new Error(errorData?.error?.message || errorData?.message || response.statusText);
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(response.statusText || 'Conversion failed');
        }
      }

      // Store the converted file
      const blob = await response.blob();
      
      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `${file.name.split('.')[0]}.${conversionType.split('to')[1].trim()}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Store the converted file for download button
      setConvertedFile({ blob, filename });
      setConverting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile) return;

    const url = window.URL.createObjectURL(convertedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.filename;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFile(null);
    setConvertedFile(null);
    setError(null);
  };

  return (
    <section id="convert" className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Convert Your Document
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {conversionType.toUpperCase()}
        </p>

        <div 
          className={`border-2 border-dashed rounded-lg p-16 text-center transition-all ${
            dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-6xl mb-6">
            {convertedFile ? '🎉' : file ? '' : '📄'}
          </div>

          {convertedFile ? (
            <div className="mb-6">
              <p className="text-2xl font-bold text-green-600 mb-2">Conversion Successful!</p>
              <p className="text-lg font-semibold text-gray-700">{convertedFile.filename}</p>
              <p className="text-sm text-gray-500 mt-2">Your file is ready to download</p>
            </div>
          ) : file ? (
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-700">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p className="text-gray-500 mb-6">Drag and drop your file here</p>
          )}

          <div className="flex gap-4 justify-center items-center flex-wrap">
            {convertedFile ? (
              <>
                <button
                  onClick={handleDownload}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition shadow-md active:scale-95 font-semibold"
                >
                    Download File
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md active:scale-95"
                >
                  Convert Another File
                </button>
              </>
            ) : (
              <>
                <label className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition shadow-md cursor-pointer active:scale-95">
                  {file ? 'Choose Different File' : 'Upload File'}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="*/*"
                  />
                </label>

                {file && !converting && (
                  <button
                    onClick={handleConvert}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition shadow-md active:scale-95"
                  >
                    Convert Now
                  </button>
                )}

                {converting && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="font-semibold">Converting...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
            Uploaded files are automatically deleted 1 hour after conversion
        </p>
      </div>
    </section>
  );
}
