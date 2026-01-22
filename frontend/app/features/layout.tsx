import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Conversion Features | 68+ Format Conversions",
  description:
    "Explore all supported document conversion formats. Convert between PDF, DOCX, XLSX, PPTX, ODT, ODS, CSV, JSON, XML, HTML, MD, TXT and more. 68 conversion routes available.",
  keywords: [
    "document conversion features",
    "supported formats",
    "conversion options",
    "file format conversion",
    "pdf conversion",
    "docx conversion",
    "xlsx conversion",
    "pptx conversion",
    "csv conversion",
    "json conversion",
    "xml conversion",
    "html conversion",
    "markdown conversion",
    "text conversion",
    "odt conversion",
    "ods conversion",
  ],
  openGraph: {
    title: "Document Conversion Features | 68+ Format Conversions | Atomix",
    description:
      "Browse all supported document conversion formats and features. Convert between 25+ formats including PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, HTML, MD, TXT, ODT, ODS and more.",
    url: "https://atomixtools.com/features",
    siteName: "Atomix",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@atomixtools",
    creator: "@atomixtools",
    title: "Document Conversion Features | 68+ Format Conversions",
    description:
      "Browse all supported document conversion formats. Convert between 25+ formats with high accuracy and preserved formatting.",
  },
  alternates: {
    canonical: "https://atomixtools.com/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
