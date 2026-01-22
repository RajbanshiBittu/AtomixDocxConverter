import type { Metadata, Viewport } from "next";
// import Navbar from "@/components/Navbar";
// import { Navbar as Navbar2 } from "@/components/Navbar2";
import {Footer} from "@/components/Footer";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import "./globals.css";


// export const metadata: Metadata = {
//   title: 'Atomix DocxConverter - Fast, Accurate & Secure Document Converter',
//   description:
//     'Convert documents between PDF, DOCX, XLSX, PPTX, CSV, ODT, TXT, MD, JSON, and more with high accuracy. Powered by LibreOffice for industry-grade conversions.',
//   keywords:
//     'document converter, file converter, pdf converter, docx to pdf, xlsx to pdf, pptx to pdf, libreoffice converter, online document conversion, secure file conversion',
//   authors: [{ name: 'Atomix Team' }],
//   icons: {
//     icon: '/favicon.svg',
//   },
//   openGraph: {
//     title: 'Atomix DocxConverter - Universal Document Conversion Tool',
//     description:
//       'High-quality document conversion with preserved layout, formatting, and styles. Fast, secure, and reliable.',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Atomix DocxConverter - Fast & Reliable Document Converter',
//     description:
//       'Universal document converter with pixel-perfect formatting and enterprise-grade reliability.',
//   },
// };



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};


export const metadata: Metadata = {

  title: {
    default:
      "Free Online Document Converter | PDF, DOCX, XLSX, PPTX | Atomix",
    template: "%s | Atomix Document Converter",
  },

  description:
    "Convert documents online instantly. Transform PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, ODT, ODS, MD & more with 99.9% accuracy. No signup required. Secure & privacy-first.",
  applicationName: "Atomix DocxConverter",
  authors: [{ name: "Atomix Team", url: "https://atomixtools.com" }],
  creator: "Atomix Team",
  publisher: "Atomix",
  referrer: "strict-origin-when-cross-origin",
  manifest: "/manifest.json",

  keywords: [
    "document converter",
    "online document converter",
    "file converter",
    "free document converter",
    "best document converter",
    
    "pdf converter",
    "convert pdf online",
    "pdf converter free",
    "docx to pdf",
    "docx to pdf converter",
    "convert docx to pdf",
    "xlsx to pdf",
    "xlsx to pdf converter",
    "convert xlsx to pdf",
    "pptx to pdf",
    "pptx to pdf converter",
    "odt to pdf",
    "ods to pdf",
    "csv to pdf",
    "json to pdf",
    "md to pdf",
    "markdown to pdf",
    "txt to pdf",
    
    "pdf to docx",
    "pdf to docx converter",
    "convert pdf to word",
    "pdf to word converter",
    "pdf to xlsx",
    "pdf to excel",
    "convert pdf to excel",
    "pdf to pptx",
    "pdf to powerpoint",
    "pdf to csv",
    "pdf to text",
    "pdf to json",
    "extract text from pdf",
    
    "docx to xlsx",
    "word to excel converter",
    "docx to odt",
    "docx to markdown",
    "xlsx to ods",
    "excel to ods",
    "pptx to odp",
    "powerpoint to pdf",
    
    "csv to json",
    "csv to json converter",
    "json to csv",
    "csv to xml",
    "xml to json",
    "xml to csv",
    "json to xml",
    "csv to excel",
    "convert csv to xlsx",
    
    "html to pdf",
    "markdown to pdf",
    "md to html",
    "html to markdown",
    "text to markdown",
    
    "secure document conversion",
    "high accuracy file converter",
    "privacy-first document converter",
    "libreoffice document converter",
    "batch document converter",
    "enterprise document converter",
    "free online file converter",
    "no registration converter",
    "instant document conversion",
    
    "how to convert pdf to word",
    "how to convert excel to pdf",
    "how to convert word to pdf",
    "best free document converter",
    "fastest document converter",
  ],

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  metadataBase: new URL("https://atomixtools.com"),
  
  alternates: {
    canonical: "https://atomixtools.com",
    languages: {
      "en-US": "https://atomixtools.com",
      "en": "https://atomixtools.com/en",
    },
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#4CAF50",
      },
    ],
  },

  openGraph: {
    title: "Atomix DocxConverter -  Free Online Document Converter",
    description:
      "Convert PDF, DOCX, XLSX, PPTX, CSV, JSON & 20+ formats online. Fast, accurate, secure. No signup needed. Try free today!",
    url: "https://atomixtools.com",
    siteName: "Atomix",
    type: "website",
    locale: "en_US",
    alternateLocale: ["en"],
  },

  twitter: {
    card: "summary_large_image",
    site: "@atomixtools",
    creator: "@atomixtools",
    title: "Atomix - Free Online Document Converter",
    description:
      "Convert PDF, DOCX, XLSX, PPTX, CSV, JSON & more online instantly. Secure, accurate & privacy-first. No signup required.",

  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Atomix Converter",
    "msapplication-TileColor": "#4CAF50",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://atomixtools.com/#organization",
      name: "Atomix",
      description: "Free online document converter supporting 25+ file formats",
      url: "https://atomixtools.com",
      logo: {
        "@type": "ImageObject",
        url: "https://atomixtools.com/logo-200x200.png",
        width: 200,
        height: 200,
      },
      sameAs: [
        "https://twitter.com/atomixtools",
        "https://github.com/atomixtools",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "",
        contactType: "Customer Support",
        areaServed: "Worldwide",
        availableLanguage: ["en"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://atomixtools.com/#website",
      url: "https://atomixtools.com",
      name: "Atomix DocxConverter",
      description: "Free online document converter for PDF, DOCX, XLSX, and more",
      isPartOf: {
        "@id": "https://atomixtools.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://atomixtools.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://atomixtools.com/#webpage",
      url: "https://atomixtools.com",
      name: "Free Online Document Converter | PDF, DOCX, XLSX | Atomix",
      description:
        "Convert documents online instantly. Transform PDF, DOCX, XLSX, PPTX, CSV, JSON, XML & more with 99.9% accuracy.",
      isPartOf: {
        "@id": "https://atomixtools.com/#website",
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://atomixtools.com/og-image-1200x630.png",
        width: 1200,
        height: 630,
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Atomix Document Converter",
      description:
        "Free online document converter supporting PDF, DOCX, XLSX, PPTX, CSV, JSON, XML and 20+ formats",
      url: "https://atomixtools.com",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I convert PDF to Word?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your PDF file to Atomix, select Word (DOCX) as the target format, and click Convert. Your file will be converted in seconds.",
          },
        },
        {
          "@type": "Question",
          name: "Is document conversion secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Atomix uses industry-standard encryption and automatically deletes files after conversion. We never store or share your documents.",
          },
        },
        {
          "@type": "Question",
          name: "What file formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support 25+ formats including PDF, DOCX, XLSX, PPTX, CSV, JSON, XML, ODT, ODS, MD, HTML, TXT and more.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to create an account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, Atomix is completely free and requires no signup. Convert unlimited documents without registration.",
          },
        },
      ],
    },
  ],
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
