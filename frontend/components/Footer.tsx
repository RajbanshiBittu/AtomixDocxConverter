// export default function Footer() {
//   return (
//     <footer className="bg-gray-100 text-slate-700 py-10">
//       <div className="max-w-7xl mx-auto flex justify-between px-4 flex-wrap gap-4">
//         <p>© 2026 Atomix Converter</p>
//         <div className="flex gap-6">
//           <span className="hover:text-white cursor-pointer">Privacy</span>
//           <span className="hover:text-white cursor-pointer">Terms</span>
//         </div>
//       </div>
//     </footer>
//   );
// }
'use client';

import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Twitter, Linkedin,Mail, Heart, Link2, Facebook } from 'lucide-react';
import { useState } from "react";


export function Footer() {
  const currentYear = new Date().getFullYear();

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
    <footer className='bg-gray-50 border-t border-gray-200 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* main footer div  */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* 1  */}
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className="bg-linear-to-r from-green-400 to-blue-500 p-2 rounded-lg shadow-md  group-hover:shadow-lg transition-all duration-200">
              </div>

              <span className="text-xl font-bold">
                <span className="text-green-500">Atomix</span><span className="text-gray-700">DocxConverter</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md mb-4">
             Fast, secure, browser-based document conversion. Convert files between multiple formats instantly without losing layout or quality.
            </p>
          </div>
          {/* 2  */}
          <div className="">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  onClick={handleHomeClick}
                  className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/features" 
                  onClick={() => setOpen(false)}
                  className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200"
                >
                  Convert
                </Link>
              </li>
            </ul>
          </div>
          {/* 3  */}
          <div className=''>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
        </div>
        {/* divide div  */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} Atomix Shortify. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors duration-200" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin />
              </Link>
              <Link href="https://facebook.com/" target='_blank' rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors duration-200" aria-label="Facebook">
                <Facebook />
              </Link>
              <Link href="mailto:contact@atomixshortify.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors duration-200" aria-label="Mail">
                <Mail />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
