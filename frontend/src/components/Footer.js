import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">Speedtar</span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Your ultimate online shopping destination. Quality products, unbeatable prices, delivered to your doorstep.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-primary-600 flex items-center justify-center transition-all">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-primary-600 flex items-center justify-center transition-all">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-primary-600 flex items-center justify-center transition-all">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-primary-600 flex items-center justify-center transition-all">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-slate-400 hover:text-white transition-all">All Products</Link></li>
              <li><Link href="/categories" className="text-slate-400 hover:text-white transition-all">Categories</Link></li>
              <li><Link href="/deals" className="text-slate-400 hover:text-white transition-all">Deals</Link></li>
              <li><Link href="/new-arrivals" className="text-slate-400 hover:text-white transition-all">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="text-slate-400 hover:text-white transition-all">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-all">Contact Us</Link></li>
              <li><Link href="/faq" className="text-slate-400 hover:text-white transition-all">FAQ</Link></li>
              <li><Link href="/shipping" className="text-slate-400 hover:text-white transition-all">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-slate-400 hover:text-white transition-all">Returns & Exchanges</Link></li>
              <li><Link href="/track-order" className="text-slate-400 hover:text-white transition-all">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-400 mt-0.5" />
                <span className="text-slate-400">123 Shopping Street, Retail City, RC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary-400" />
                <span className="text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary-400" />
                <span className="text-slate-400">support@speedtar.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 Speedtar. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-all">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition-all">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
