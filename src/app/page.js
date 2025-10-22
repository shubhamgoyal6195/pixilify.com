// src/app/page.jsx
import Link from 'next/link';
import AllInOneClient from "../app/all-in-one-client/AllInOneClient"
import ToolCard from '../components/ToolCard';

// We'll link directly to the Image Resizer, which is your main tool.

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-4">
            Image Magic: Fast, Free & Private.
          </h1>
          <p className="text-xl text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto">
            The complete toolkit for instant photo editing. Resize, compress, and convert any image without ever leaving your browser.
          </p>
        </header>

        {/* 1. DOMINANT ACTION BLOCK (Mimics the screenshot) */}
        <div className="flex items-center justify-center mb-24">
          <div className='bg-[#e0eaff]'>

          </div>
          <div className="w-full max-w-6xl bg-[#6e99f4] rounded border-4 border-dashed border-[#6e99f4] shadow-xl text-center">
            
            <AllInOneClient/>
          </div>
        </div>

        {/* Tools Grid Section Header */}
        <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
                Our Complete Toolkit
            </h2>
            <p className="text-lg text-gray-600 dark:text-zinc-400 mt-2">
                A growing collection of fast, privacy-focused image tools for every need.
            </p>
        </header>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Image Resizer / Cropper (Implemented) */}
          <ToolCard
            icon="📏"
            title="Image Resizer / Cropper"
            description="Precisely crop, zoom, and resize images by dimensions or percentage. Perfect for social media and web assets."
            href="/image-resizer"
            status="Live"
          />

          {/* 2. Image Converter (Next to implement) */}
          <ToolCard
            icon="🔁"
            title="Image Converter"
            description="Convert formats like JPG ⇄ PNG ⇄ WEBP locally without any quality loss."
            href="/image-converter"
            status="Live"
          />

          {/* 3. Image Compressor */}
          <ToolCard
            icon="🗜️"
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
            href="/photo-to-pdf"
            status="Building"
          />
          
          {/* 5. Image Filters & Effects */}
          <ToolCard
            icon="🎨"
            title="Image Filters & Effects"
            description="Apply grayscale, brightness, contrast, and blur filters using sliders."
            href="/image-filters"
            status="Building"
          />

          {/* 6. Image Color Extractor */}
          <ToolCard
            icon="🌈"
            title="Image Color Extractor"
            description="Upload an image to extract the top 10 colors, complete with HEX/RGB codes."
            href="/color-extractor"
            status="Building"
          />
        </div>
        
        {/* 2. FEATURE ROW (Mimics the icons below the upload block) */}
        <div className="mt-16 border-t border-gray-100 pt-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Pixilify?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                
                <div className="flex flex-col items-center">
                    <div className="text-4xl text-green-600 mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                    <p className="text-gray-600">No server uploads means instant processing. Get results in milliseconds, not minutes.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-4xl text-indigo-600 mb-4">🔒</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Maximum Privacy</h3>
                    <p className="text-gray-600">Your files never leave your browser. We guarantee 100% security for all your photo edits.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="text-4xl text-yellow-600 mb-4">📐</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfect Quality</h3>
                    <p className="text-gray-600">High-fidelity conversions and resizing using the browser's native Canvas API.</p>
                </div>

            </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-24 text-center text-sm text-gray-400">
            Also available: <Link href="/image-converter" className="text-indigo-600 hover:underline">Image Converter</Link> and <Link href="/image-compressor" className="text-indigo-600 hover:underline">Image Compressor</Link>.
        </footer>

      </div>
    </div>
  );
}