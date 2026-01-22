// components/ReadyToConvert.tsx
'use client';
import Link from "next/link";

interface ReadyToConvertProps {
  onShowFeatures?: () => void;
}

export default function ReadyToConvert({ onShowFeatures }: ReadyToConvertProps) {
  return (
    <section className="py-15 bg-green-500 text-white text-center">
      <h2 className="text-5xl font-bold mb-2 text-white">
        Get Started Today!
      </h2>
      <h2 className="text-2xl font-bold mb-2 text-green-500">
        Transform your documents in just a few clicks
      </h2>
      {/* <button 
        onClick={onShowFeatures}
        className="bg-white text-green-600 px-8 py-3 rounded-lg
                         hover:bg-slate-100 transition shadow">
        Start Converting Now →
      </button> */}
      <Link href="/convert" className="bg-white text-green-600 hover:bg-slate-300 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md active:scale-95">
        Start Converting Now →
      </Link>
    </section>
  );
}
