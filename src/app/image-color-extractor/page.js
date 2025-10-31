import ColorExtractorClient from './ColorExtractorClient';

// Add SEO Metadata
export const metadata = {
  title: 'Free Image Color Extractor - Pixilify',
  description: 'Extract the top 10 dominant colors from any image with HEX and RGB codes. Fast, private, and 100% client-side color analysis.',
  keywords: ['image color extractor', 'dominant colors', 'get color from image', 'hex code extractor', 'frontend color tool'],
};

export default function ColorExtractorPage() {
  return (
    <>
      <ColorExtractorClient />

      {/* SEO CONTENT SECTION - RENDERED BY SERVER FOR OPTIMAL SEO */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Analyze Image Colors Locally</h2>
        <p className="text-gray-600 mb-4">
          The **Image Color Extractor** analyzes your uploaded image to identify and rank the **most dominant colors**. This is perfect for designers, developers, and artists needing to match or understand an image's palette. All processing is done <strong className="font-semibold">client-side</strong> using the Canvas API, ensuring your images and data are kept **secure**.
        </p>

        <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">How It Works:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>**Client-Side Processing:** No image upload required for analysis.</li>
          <li>**Accurate Palette:** Extracts the top 10 most common colors.</li>
          <li>**Code Ready:** Provides colors in both **HEX** and **RGB** formats.</li>
          <li>**Instant Results:** Get the color palette in seconds.</li>
        </ul>
      </section>
    </>
  );
}