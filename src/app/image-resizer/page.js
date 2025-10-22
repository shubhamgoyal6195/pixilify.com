// src/app/image-resizer/page.jsx
import ImageResizerClient from './ImageResizerClient';

// Add SEO Metadata (This is the Next.js way to handle metadata in the App Router)
export const metadata = {
  title: 'Free Image Resizer & Cropper - Pixilify',
  description: 'Resize, crop, and transform your images instantly and locally with Pixilify’s frontend-only image tool. Fast, private, and secure.',
  keywords: ['image resizer', 'image cropper', 'frontend image tool', 'online image editor', 'free image resizer'],
};

export default function ImageResizerPage() {
  return (
    <>
      <ImageResizerClient />

      {/* SEO CONTENT SECTION - RENDERED BY SERVER FOR OPTIMAL SEO */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Use Pixilify's Image Resizer?</h2>
        <p className="text-gray-600 mb-4">
          The **Pixilify Image Resizer** is a powerful tool designed for speed and privacy. Since all image manipulation is done <strong className="font-semibold">100% in your browser</strong> using the Canvas API, your files <strong className="font-semibold">never leave your computer</strong>. This guarantees that your file manipulation is extremely fast and perfectly secure. Use it to quickly prepare images for social media, websites, or email attachments.
        </p>

        <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">Features You'll Love:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>**Pure Privacy:** All processing is done locally; no server uploads are required.</li>
          <li>**Precise Cropping:** Easily select the exact area you want to keep.</li>
          <li>**Instant Preview:** See the changes in real-time before downloading.</li>
          <li>**Rotation & Zoom:** Fine-tune your image with advanced controls.</li>
        </ul>
      </section>
    </>
  );
}