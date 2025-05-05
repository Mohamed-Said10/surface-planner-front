import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Services</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Portfolio</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Real Estate Photography</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Videography & Virtual Tours</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">2D & 3D Floor Plans</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">AI Room Staging</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Add-On Services</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">FAQs</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Booking Policy</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Payment & Refunds</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Terms & Conditions</Link></li>
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-gray-600">Enhancing Property Listings with High-Quality Visuals & AI-Powered Features</p>
            <div className="mt-6 flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">© 2025 Surface Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}