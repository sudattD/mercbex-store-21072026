import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">MERCBEX</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-brand-300">
              India&apos;s trusted manufacturer of premium crop protection products.
              Government registered, lab tested, and trusted by 50,000+ farmers.
            </p>
            <div className="flex gap-3">
              {["F", "X", "I", "Y"].map((letter) => (
                <a
                  key={letter}
                  href="#"
                  className="w-9 h-9 bg-brand-900 hover:bg-brand-700 rounded-lg flex items-center justify-center transition text-xs font-bold text-brand-300 hover:text-white"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/products?category=insecticide", label: "Insecticides" },
                { href: "/products?category=fungicide", label: "Fungicides" },
                { href: "/products?category=herbicide", label: "Herbicides" },
                { href: "/products?category=rodenticide", label: "Rodenticides" },
                { href: "/products?category=pgr", label: "Plant Growth Regulators" },
                { href: "/products", label: "View All Products" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-300 hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                "Crop Advisory (Free)",
                "Track Your Order",
                "Return & Refund Policy",
                "Shipping Information",
                "Safety Data Sheets",
                "Application Guides",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-brand-300 hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-brand-300">MERCBEX Agrochemicals Pvt. Ltd., Sector 12, Gurugram, Haryana 122001</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+911800123456" className="text-brand-300 hover:text-white transition font-medium">1800-123-456 (Toll-free)</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@mercbex.in" className="text-brand-300 hover:text-white transition">support@mercbex.in</a>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-brand-900/50 rounded-lg border border-brand-800">
              <p className="text-xs text-brand-400 mb-1">CIN: U74999HR2020PTC089012</p>
              <p className="text-xs text-brand-400">GST: 06AABCU9603R1ZM</p>
              <p className="text-xs text-brand-400">Pesticide Mfg. License: HR/PL/2020/1234</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-400">
            &copy; {new Date().getFullYear()} MERCBEX Agrochemicals Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-brand-500 font-medium">
            <span>CIB Registered</span>
            <span>ISO 9001:2015</span>
            <span>GLP Certified</span>
            <span>BIS Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
