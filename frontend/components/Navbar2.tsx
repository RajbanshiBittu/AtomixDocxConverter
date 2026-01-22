"use client";

import { Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logos/logo.png" 
              alt="Atomix Tools Logo" 
              width={200} 
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative">
              <Link href="/tools" className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Tools
                <ChevronDown className="h-4 w-4 transition-transform" />
              </Link>
            </div>

            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Dark Mode Toggle */}
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-5 w-5 text-gray-700" />
            </button>
            <Link href="/auth/login">
              <button className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile menu button and dark mode */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              <Moon className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
