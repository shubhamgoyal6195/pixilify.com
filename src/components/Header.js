// src/components/Header.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Lucide icons for hamburger/close

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/img/pixilify.png" className="w-[150px]" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium"
          >
            Home
          </Link>
          <Link 
            href="/image-resizer" 
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium transition duration-150 hover:bg-indigo-50"
          >
            Image Resizer
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center py-3 space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/image-resizer"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Image Resizer
            </Link>
            <Link
              href="/image-converter"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Image Converter
            </Link>
            <Link
              href="/image-compressor"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
            Photo to PDF Converter
            </Link>
            <Link
              href="/image-filters"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
            Image Filters & Effects
            </Link>
            <Link
              href="/image-color-extractor"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
             Image Color Extractor
            </Link>
            <Link
              href="/split-pdf"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
             Split PDF
            </Link>
            <Link
              href="/merge-pdf"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
             Merge PDF
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
