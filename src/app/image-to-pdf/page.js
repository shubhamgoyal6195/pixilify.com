import PhotoToPdfClient from './PhotoToPdfClient';

// Add SEO Metadata
export const metadata = {
  title: 'Free Photo to PDF Converter - Pixilify',
  description: 'Merge multiple images (JPG, PNG) into a single PDF document directly in your browser. Fast, private, and secure PDF conversion.',
  keywords: ['photo to pdf', 'image to pdf', 'merge images to pdf', 'frontend pdf converter', 'free pdf tool'],
};

export default function PhotoToPdfPage() {
  return (
    <>
      <PhotoToPdfClient />

      {/* SEO CONTENT SECTION - RENDERED BY SERVER FOR OPTIMAL SEO */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Convert Images to PDF Locally</h2>
        <p className="text-gray-600 mb-4">
          Our **Photo to PDF Converter** tool is designed for **maximum privacy**. Like all our tools, conversion happens <strong className="font-semibold">100% in your browser</strong>, meaning your sensitive images <strong className="font-semibold">never leave your device</strong>. Simply select your images, arrange them, and download your perfect PDF document instantly.
        </p>

        <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">Key Features:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>**Pure Privacy:** No server upload or storage.</li>
          <li>**Multiple Formats:** Supports JPG, PNG, and more.</li>
          <li>**Easy Reordering:** Drag and drop to set the page order.</li>
          <li>**Custom Options:** Adjust page size and orientation (e.g., A4, Letter).</li>
        </ul>
      </section>
    </>
  );
}