// src/app/image-compressor/page.jsx
import ImageCompressorClient from './ImageCompressorClient';

export const metadata = {
  title: 'Free Image Compressor (Online) - Pixilify',
  description: 'Compress JPG and WEBP images instantly and privately in your browser. Reduce file size without uploading to a server.',
  keywords: ['image compressor', 'compress jpg', 'reduce file size', 'frontend image compression', 'optimize image for web'],
};

export default function ImageCompressorPage() {
  return (
    <>
      <ImageCompressorClient />
      {/* SEO Content */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Fast and Secure Image Compression</h2>
        <p className="text-gray-600 mb-4">
          Pixilify's Image Compressor uses the native browser canvas to adjust the quality setting of JPEG and WEBP files. Since compression happens locally on your computer, you get instant results and absolute privacy.
        </p>
      </section>
    </>
  );
}