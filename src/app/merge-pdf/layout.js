export const metadata = {
  title: 'Merge PDF Files Online - Pixilify',
  description:
    'Combine multiple PDF files into a single PDF instantly. 100% client-side merging, fast and private — your files never leave your device.',
  keywords: [
    'merge pdf',
    'combine pdfs',
    'pdf merger',
    'online pdf joiner',
    'frontend pdf tool',
    'pixilify pdf merge',
  ],
  openGraph: {
    title: 'Free PDF Merger - Pixilify',
    description:
      'Merge multiple PDF files directly in your browser. No upload, no watermark, just instant privacy-focused merging.',
    url: 'https://pixilify.com/merge-pdf',
    type: 'website',
  },
};

export default function MergePdfLayout({ children }) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {children}
    </main>
  );
}
