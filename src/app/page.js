// src/app/page.jsx
import Link from "next/link";
import AllInOneClient from "../app/all-in-one-client/AllInOneClient";
import ToolCard from "../components/ToolCard";

// We'll link directly to the Image Resizer, which is your main tool.

export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Image Magic: Fast, Free & Private.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The complete toolkit for instant photo editing. Resize, compress,
            and convert any image without ever leaving your browser.
          </p>
        </header>

        {/* 1. DOMINANT ACTION BLOCK (Mimics the screenshot) */}
        <div className="flex items-center justify-center mb-24">
          <div className="bg-[#e0eaff]"></div>
          <div className="w-full max-w-6xl bg-[#6e99f4] rounded border-4 border-dashed border-[#6e99f4] shadow-xl text-center">
            <AllInOneClient />
          </div>
        </div>

        {/* Tools Grid Section Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our Complete Toolkit
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            A growing collection of fast, privacy-focused image tools for every
            need.
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Image Resizer / Cropper (Implemented) */}
          <ToolCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-blue-600" // Adjust color as needed
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            }
            title="Image Resizer / Cropper"
            description="Precisely crop, zoom, and resize images by dimensions or percentage. Perfect for social media and web assets."
            href="/image-resizer"
            status="Live"
          />

          {/* 2. Image Converter (Next to implement) */}
          <ToolCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-indigo-600" // Adjust color as needed
              >
                {/* Source File (A stylized JPG/PNG rectangle) */}
                <rect
                  x="3"
                  y="2"
                  width="10"
                  height="12"
                  rx="1"
                  ry="1"
                  fill="#FFD17F"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
                {/* Source file text (JPG) */}
                <text x="5" y="12" fontSize="3" fontWeight="bold" fill="#333">
                  JPG
                </text>

                {/* Destination File (A stylized WEBP/GIF shape) */}
                {/* This shape is slightly more complex for differentiation */}
                <path
                  d="M11 10h10V21a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-5h-1a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z"
                  fill="#9AE6B4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Destination file text (PNG) */}
                <text x="13" y="19" fontSize="3" fontWeight="bold" fill="#333">
                  PNG
                </text>

                {/* Conversion Arrow (Curved and Dynamic) */}
                <path
                  d="M13 5c2 0 4 3 4 7s-2 7-4 7"
                  fill="none"
                  stroke="#6B46C1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2" // Dashed line for dynamic feel
                />

                {/* Arrow Tip */}
                <polyline
                  points="15 15 17 19 19 15"
                  stroke="#6B46C1"
                  strokeWidth="2"
                  fill="none"
                  transform="rotate(20, 17, 17)"
                />
              </svg>
            }
            title="Image Converter"
            description="Convert formats like JPG ⇄ PNG ⇄ WEBP locally without any quality loss."
            href="/image-converter"
            status="Live"
          />

          {/* 3. Image Compressor */}
          <ToolCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-green-600" // Adjust main color as needed
              >
                {/* Large, uncompressed file shape */}
                <rect
                  x="2"
                  y="5"
                  width="12"
                  height="14"
                  rx="1.5"
                  ry="1.5"
                  fill="#B2F5EA"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Little folded corner for the large file */}
                <path
                  d="M10 5L14 9L10 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M14 5V9H10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                {/* Small, compressed file shape - visually behind and right */}
                <rect
                  x="10"
                  y="8"
                  width="8"
                  height="10"
                  rx="1"
                  ry="1"
                  fill="#6EE7B7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Little folded corner for the small file */}
                <path
                  d="M15 8L18 11L15 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M18 8V11H15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                {/* Compression Arrow - Curved and pushing from left to right */}
                <path
                  d="M6 14c2 0 4-2 4-4s-2-4-4-4"
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 2" // Dashed for active process
                />
                {/* Arrowhead */}
                <polyline
                  points="9 8 11 10 9 12"
                  stroke="#38A169"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Small Star/Sparkle for quality/optimization (on the smaller file) */}
                <path
                  d="M18 6l-1 2 2 1-2 1-1 2-1-2-2-1 2-1-1-2z"
                  fill="#F6E05E"
                  stroke="#ECC94B"
                  strokeWidth="0.5"
                />
              </svg>
            }
            title="Image Compressor"
            description="Reduce file size by adjusting the quality of JPEG or WebP images instantly."
            href="/image-compressor"
            status="Live"
          />

          {/* 4. Photo to PDF Converter */}
          <ToolCard
            icon="📚"
            title="Photo to PDF Converter"
            description="Merge multiple images into a single PDF document, all in your browser."
            href="/image-to-pdf"
            status="Live"
          />

          {/* 5. Image Filters & Effects */}
          <ToolCard
            icon="🎨"
            title="Image Filters & Effects"
            description="Apply grayscale, brightness, contrast, and blur filters using sliders."
            href="/image-filters"
            status="Live"
          />

          {/* 6. Image Color Extractor */}
          <ToolCard
            icon="🌈"
            title="Image Color Extractor"
            description="Upload an image to extract the top 10 colors, complete with HEX/RGB codes."
            href="/image-color-extractor"
            status="Live"
          />
        </div>

        {/* 2. FEATURE ROW (Mimics the icons below the upload block) */}
        <div className="mt-16 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Pixilify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl text-green-600 mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                No server uploads means instant processing. Get results in
                milliseconds, not minutes.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl text-indigo-600 mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Maximum Privacy
              </h3>
              <p className="text-gray-600">
                Your files never leave your browser. We guarantee 100% security
                for all your photo edits.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl text-yellow-600 mb-4">📐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Perfect Quality
              </h3>
              <p className="text-gray-600">
                High-fidelity conversions and resizing using the browser's
                native Canvas API.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-24 text-center text-sm text-gray-400">
          Also available:{" "}
          <Link
            href="/image-converter"
            className="text-indigo-600 hover:underline"
          >
            Image Converter
          </Link>{" "}
          and{" "}
          <Link
            href="/image-compressor"
            className="text-indigo-600 hover:underline"
          >
            Image Compressor
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}
