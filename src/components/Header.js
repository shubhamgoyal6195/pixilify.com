
// src/components/Header.jsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        
        {/* Logo/Brand */}
        <Link href="/" className="">
          <img src="/img/pixilify.png" className="w-[150px]" alt="Logo"></img>
        </Link>
        
        {/* Navigation */}
        <nav className="space-x-6 flex items-center">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-indigo-600 transition duration-150 font-medium"
          >
            Home
          </Link>
          <Link 
            href="/image-resizer" 
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium transition duration-150 hover:bg-indigo-50"
          >
            Image Resizer
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;