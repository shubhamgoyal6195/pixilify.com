
// src/components/Header.jsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo/Brand */}
        <Link href="/" className="text-3xl font-extrabold text-indigo-600 tracking-tight transition duration-150 hover:text-indigo-700">
          Pixilify
        </Link>
        
        {/* Navigation */}
        <nav className="space-x-6 flex items-center">
          <Link 
            href="/" 
            className="text-gray-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 font-medium"
          >
            Home
          </Link>
          <Link 
            href="/image-resizer" 
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium transition duration-150 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-zinc-800"
          >
            Image Resizer
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;