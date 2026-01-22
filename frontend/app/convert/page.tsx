'use client';

import { useState } from "react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import ConversionPanel from "@/components/ConversionPanel";

// Format conversion mappings based on backend routes
const conversionMappings: Record<string, string[]> = {
  'docx': ['pdf', 'odt', 'txt', 'html', 'pptx', 'xlsx', 'md'],
  'xlsx': ['pdf', 'ods', 'csv', 'json', 'xml', 'html', 'txt'],
  'pptx': ['pdf', 'txt', 'html', 'md'],
  'odt': ['pdf', 'docx', 'txt', 'html', 'md', 'pptx'],
  'ods': ['pdf', 'xlsx', 'csv', 'html', 'txt'],
  'html': ['pdf', 'md', 'docx', 'txt', 'xlsx', 'csv'],
  'pdf': ['docx', 'text', 'xlsx', 'json', 'csv', 'html'],
  'csv': ['json', 'xml', 'xlsx', 'html', 'pdf', 'txt'],
  'json': ['xml', 'csv', 'xlsx', 'html', 'md'],
  'xml': ['json', 'csv', 'xlsx', 'html', 'pdf'],
  'text': ['md', 'docx', 'pdf', 'html'],
  'md': ['text', 'html', 'pdf', 'docx', 'odt', 'pptx']
};

// All supported formats
const allFormats = [
  { value: 'docx', label: 'DOCX' },
  { value: 'pdf', label: 'PDF' },
  { value: 'xlsx', label: 'XLSX' },
  { value: 'pptx', label: 'PPTX' },
  { value: 'odt', label: 'ODT' },
  { value: 'ods', label: 'ODS' },
  { value: 'html', label: 'HTML' },
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'text', label: 'TXT' },
  { value: 'md', label: 'Markdown' }
];

export default function Convert() {
  const [fromFormat, setFromFormat] = useState<string>('');
  const [toFormat, setToFormat] = useState<string>('');
  const [showConversionPanel, setShowConversionPanel] = useState(false);

  // Get available target formats based on source format
  const getAvailableTargets = (): string[] => {
    if (!fromFormat) return [];
    return conversionMappings[fromFormat] || [];
  };

  // Handle from format change
  const handleFromFormatChange = (value: string) => {
    setFromFormat(value);
    setToFormat(''); // Reset target when source changes
    setShowConversionPanel(false);
  };

  // Handle to format change
  const handleToFormatChange = (value: string) => {
    setToFormat(value);
    setShowConversionPanel(false);
  };

  // Check if conversion is valid
  const isConversionValid = (): boolean => {
    return !!(fromFormat && toFormat && fromFormat !== toFormat);
  };

  // Handle swap formats
  const handleSwapFormats = () => {
    if (fromFormat && toFormat) {
      const temp = fromFormat;
      setFromFormat(toFormat);
      setToFormat(temp);
      setShowConversionPanel(false);
    }
  };

  // Handle start conversion
  const handleStartConversion = () => {
    if (isConversionValid()) {
      setShowConversionPanel(true);
      // Scroll to conversion panel after render
      setTimeout(() => {
        document.getElementById("conversion-panel")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Convert Your Documents
            </h1>
            <p className="mt-2 text-lg text-green-500">
              Select your source format and target format to begin conversion
            </p>
          </div>

          {/* Format Selection Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-center gap-6 mb-8">
              {/* From Format Dropdown */}
              <div className="flex-1 max-w-xs">
                <label 
                  htmlFor="from-format" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  From Format
                </label>
                <select
                  id="from-format"
                  value={fromFormat}
                  onChange={(e) => handleFromFormatChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-900 font-medium cursor-pointer hover:border-gray-400"
                >
                  <option value="">Select format...</option>
                  {allFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bidirectional Arrow Icon */}
              <div className="flex items-end pb-3">
                <button
                  onClick={handleSwapFormats}
                  disabled={!fromFormat || !toFormat}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    fromFormat && toFormat
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95'
                      : 'bg-gray-100 cursor-not-allowed opacity-50'
                  }`}
                  title={fromFormat && toFormat ? 'Swap formats' : 'Select both formats first'}
                  aria-label="Swap from and to formats"
                >
                  <ArrowsRightLeftIcon 
                    className={`h-6 w-6 transition-colors duration-300 ${
                      fromFormat && toFormat ? 'text-green-600' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* To Format Dropdown */}
              <div className="flex-1 max-w-xs">
                <label 
                  htmlFor="to-format" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  To Format
                </label>
                <select
                  id="to-format"
                  value={toFormat}
                  onChange={(e) => handleToFormatChange(e.target.value)}
                  disabled={!fromFormat}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 font-medium ${
                    !fromFormat
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-900 cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                  }`}
                  aria-disabled={!fromFormat}
                >
                  <option value="">
                    {fromFormat ? 'Select format...' : 'Select source first...'}
                  </option>
                  {fromFormat && getAvailableTargets().map((target) => {
                    const targetFormat = allFormats.find(f => f.value === target);
                    return (
                      <option key={target} value={target}>
                        {targetFormat?.label || target.toUpperCase()}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Conversion Path Display */}
            {fromFormat && toFormat && (
              <div className="text-center py-4 px-6 bg-green-50 rounded-lg border border-green-200 mb-6">
                <p className="text-sm text-gray-600">
                  Converting from <span className="font-semibold text-green-600">{allFormats.find(f => f.value === fromFormat)?.label}</span>
                  {' '} to {' '}
                  <span className="font-semibold text-green-600">{allFormats.find(f => f.value === toFormat)?.label}</span>
                </p>
              </div>
            )}

            {/* Start Converting Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartConversion}
                disabled={!isConversionValid()}
                className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
                  isConversionValid()
                    ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer hover:shadow-lg active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                }`}
                aria-disabled={!isConversionValid()}
              >
                Start Converting →
              </button>
            </div>
          </div>

          {/* Helper Text */}
          <div className="text-center text-sm text-gray-500">
            <p>Select both formats to enable the conversion button</p>
          </div>
        </div>
      </section>

      {/* Conversion Panel */}
      {showConversionPanel && (
        <div id="conversion-panel">
          <ConversionPanel 
            conversionType={`${fromFormat} to ${toFormat}`} 
          />
        </div>
      )}
    </>
  );
}