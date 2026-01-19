'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-linear-to-r from-green-400 to-blue-500 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200">
            </div>
            <span className="text-xl font-bold">
              <span className="text-green-500">Atomix</span><span className="text-gray-700">DocxConverter</span>
            </span>
          </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 font-medium">
          <Link 
            href="/" 
            onClick={handleHomeClick}
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            href="/features" 
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
          >
            Convert
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/features" 
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Convert Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow border-t">
          <div className="flex flex-col items-center gap-6 py-6">
            <Link 
              href="/" 
              onClick={handleHomeClick}
              className="hover:text-green-500"
            >
              Home
            </Link>
            <Link 
              href="/features" 
              onClick={() => setOpen(false)}
              className="hover:text-green-500"
            >
              Convert
            </Link>
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="bg-green-500 text-white px-8 py-3 rounded-lg
                         hover:bg-green-600 transition shadow"
            >
              Convert Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
