// src/components/Footer.jsx

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-zinc-950 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          {/* Copyright */}
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-4 md:mb-0">
            © {currentYear} Pixilify. All rights reserved.
          </p>

          {/* Privacy Statement */}
          <div className="text-sm text-gray-300 dark:text-zinc-400">
            <span className="font-semibold text-green-400">100% Client-Side Processing.</span> Your images never leave your browser.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;