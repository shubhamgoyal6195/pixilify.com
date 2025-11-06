export const metadata = {
  title: 'Split PDF Files Online - Pixilify',
  description:
    'Easily split a single PDF file into multiple, separate PDF documents instantly. 100% client-side processing, fast and private — your files never leave your device.',
  keywords: [
    'split pdf',
    'separate pdf',
    'pdf splitter',
    'online pdf tool',
    'frontend pdf tool',
    'pixilify pdf split',
  ],
  openGraph: {
    title: 'Free PDF Splitter - Pixilify',
    description:
      'Split a single PDF file directly in your browser. No upload, no watermark, just instant privacy-focused splitting.',
    url: 'https://pixilify.com/split-pdf',
    type: 'website',
  },
};

export default function SplitPdfLayout({ children }) {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {children}
    </main>
  );
}