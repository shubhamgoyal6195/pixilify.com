// src/app/layout.js
import './globals.css';
// You might have font imports here if using a specific font like Inter or a custom one
import Header from '../components/Header'; // Assuming path is correct
import Footer from '../components/Footer';

export const metadata = {
  title: "Pixilify: Fast, Free & Private Online Image Tools",
  description:
    "Pixilify offers a full suite of fast, free, and private image manipulation tools: Resizer, Cropper, Converter (JPG, PNG, WEBP), and Compressor. All processing is done instantly in your browser.",
  keywords: [
    "image resizer",
    "free image converter",
    "image compressor",
    "online cropper",
    "private image tools",
    "ad-free photo editor",
    "convert jpg to webp",
    "resize image online",
    "frontend image tools",
    "image format converter",
  ],
  authors: [{ name: "Pixilify" }],

  openGraph: {
    title: "Pixilify: Fast, Free & Private Online Image Tools",
    description:
      "Resize, crop, convert, and compress images instantly and securely with Pixilify. Your files never leave your browser—100% private.",
    url: "https://pixilify.com/",
    siteName: "Pixilify",
    images: [
      {
        // Placeholder path: You'll need to create this image in your 'public' folder
        url: "/img/pixilify-og-image.png", 
        width: 1200,
        height: 630,
        alt: "Pixilify Logo and Tool Previews",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    // Replace with your actual Twitter handle if you create one
    site: "@PixilifyTools", 
    creator: "@PixilifyTools",
    title: "Pixilify: Fast, Free & Private Online Image Tools",
    description:
      "The best fast and free online image tools: Resizer, Converter, and Compressor. Process photos instantly and securely in your browser.",
    images: ["/img/pixilify-og-image.png"],
  },

  icons: {
    // Ensure you create these files and place them in the 'public' directory
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    // Replace with your actual deployed URL
    canonical: "https://pixilify.com/",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 overflow-x-hidden">
        {/* Placeholder for Header Component */}
       <Header/>
        <main>
          {children}
        </main>
        {/* Placeholder for Footer Component */}
       <Footer/>
      </body>
    </html>
  );
}