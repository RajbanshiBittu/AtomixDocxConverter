import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import {Footer} from "@/components/Footer";
import "./globals.css";


export const metadata: Metadata = {
  title: 'Atomix DocConvert - Fast, Accurate & Secure Document Converter',
  description:
    'Convert documents between PDF, DOCX, XLSX, PPTX, CSV, ODT, TXT, MD, JSON, and more with high accuracy. Powered by LibreOffice for industry-grade conversions.',
  keywords:
    'document converter, file converter, pdf converter, docx to pdf, xlsx to pdf, pptx to pdf, libreoffice converter, online document conversion, secure file conversion',
  authors: [{ name: 'Atomix Team' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Atomix DocConvert - Universal Document Conversion Tool',
    description:
      'High-quality document conversion with preserved layout, formatting, and styles. Fast, secure, and reliable.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atomix DocConvert',
    description:
      'Universal document converter with pixel-perfect formatting and enterprise-grade reliability.',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
