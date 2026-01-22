import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Documents Online | Free Converter Tool",
  description:
    "Convert your documents online instantly. Select source and target formats from 25+ options including PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, HTML, MD, TXT. No signup required.",
  keywords: [
    "convert documents online",
    "online converter",
    "free document converter",
    "convert pdf",
    "convert docx",
    "convert xlsx",
    "convert pptx",
    "convert csv",
    "convert json",
    "convert xml",
    "convert html",
    "convert markdown",
    "file conversion tool",
    "format converter",
    "document transformation",
  ],
  openGraph: {
    title: "Convert Documents Online | Free Converter Tool | Atomix",
    description:
      "Convert your documents online instantly. Select from 25+ formats and convert with 99.9% accuracy. Fast, secure, and completely free. No signup required.",
    url: "https://atomixtools.com/convert",
    siteName: "Atomix",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@atomixtools",
    creator: "@atomixtools",
    title: "Convert Documents Online | Free Converter Tool",
    description:
      "Convert your documents online instantly. Select from 25+ formats and convert with high accuracy. No signup required.",
  },
  alternates: {
    canonical: "https://atomixtools.com/convert",
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
