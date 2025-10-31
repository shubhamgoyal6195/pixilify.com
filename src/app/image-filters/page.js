import ImageFiltersClient from './ImageFiltersClient';

// Add SEO Metadata
export const metadata = {
  title: 'Free Image Filters & Effects - Pixilify',
  description: 'Apply various filters and effects like grayscale, sepia, brightness, contrast, and blur to your images instantly in your browser.',
  keywords: ['image filters', 'photo effects', 'grayscale image', 'blur image', 'brightness contrast', 'sepia filter', 'frontend image editor'],
};

export default function ImageFiltersPage() {
  return (
    <>
      <ImageFiltersClient />

      {/* SEO CONTENT SECTION - RENDERED BY SERVER FOR OPTIMAL SEO */}
      <section className="p-8 max-w-6xl mx-auto mt-12 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Apply Filters & Effects Instantly</h2>
        <p className="text-gray-600 mb-4">
          The **Pixilify Image Filters & Effects** tool lets you enhance or stylize your photos with a range of popular filters. Adjust <strong className="font-semibold">brightness, contrast, saturation, blur</strong>, or apply classic effects like <strong className="font-semibold">grayscale and sepia</strong>. All operations are performed <strong className="font-semibold">directly in your browser</strong>, ensuring your images remain private and processing is lightning fast.
        </p>

        <h3 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">Features You'll Appreciate:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>**Real-time Previews:** See changes as you adjust sliders.</li>
          <li>**Variety of Filters:** From basic adjustments to artistic effects.</li>
          <li>**No Uploads:** Your images stay on your device.</li>
          <li>**High Quality Output:** Download your filtered image in various formats.</li>
        </ul>
      </section>
    </>
  );
}