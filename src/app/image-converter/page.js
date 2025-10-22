// src/app/image-converter/page.jsx
import ImageConverterClient from './ImageConverterClient';

export const metadata = {
  title: 'Free Image Converter (JPG, PNG, WEBP) - Pixilify',
  description: 'Convert images between JPG, PNG, and WEBP formats instantly and securely in your browser. Fast, private, and 100% frontend.',
  keywords: ['image converter', 'convert jpg to png', 'convert webp to jpg', 'frontend image tool', 'free image format change'],
};

export default function ImageConverterPage() {
  return (
    <>
      <ImageConverterClient />
      {/* SEO Content */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Pixilify is the Best Image Converter</h2>
        <p className="text-gray-600 mb-4">
          Our Image Converter runs entirely in your browser using the **Canvas API**. This means conversion is instantaneous and your file security is guaranteed because the image data never leaves your device. Perfect for designers and web developers who need fast format switching.
        </p>
      </section>
    </>
  );
}