import { megaFooterLinks } from "../utils/master";

const bottomLinks = [
  { name: 'About Us', link: '/about' },
  { name: 'Privacy', link: '/privacy' },
  { name: 'Terms', link: '/terms' },
  { name: 'Contact', link: '/contact-us' },
];

const MegaFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-mega bg-gray-800 mt-16 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section: Link Columns */}
        {Object.entries(megaFooterLinks).length > 0 && (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8 pb-10">
          {Object.entries(megaFooterLinks).map(([title, links]) => (
            <div key={title} className="text-sm">
              <h3 className="font-semibold text-gray-300 mb-3 uppercase tracking-wider">{title}</h3>
              <ul className="space-y-1">
                {links.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className="text-gray-400 hover:text-red-400 transition"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>)}
      

        {/* Separator */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section: Footer Links, Logo, and Copyright */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center text-sm">

          {/* Bottom Navigation Links */}
          <div className="flex flex-wrap justify-center lg:justify-start space-x-4">
            {bottomLinks.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="text-gray-400 hover:text-white transition whitespace-nowrap"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Logo and Copyright - Updated for Pixilify */}
          <div className="flex flex-col items-center lg:flex-row lg:space-x-4">
            {/* Pixilify Logo Placeholder */}
            <div className="flex items-center space-x-2 text-xl font-bold text-red-500 mb-2 lg:mb-0">
              <span className="text-gray-300">Pixilify</span>
            </div>

            <p className="text-gray-500 text-xs">
              © {currentYear} Pixilify. Free Online Tools. All rights reserved.

            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MegaFooter;