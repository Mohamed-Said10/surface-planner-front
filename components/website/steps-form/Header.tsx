import { Camera } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Surface Planner</span>
          </div>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Portfolio</Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">Packages</Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">FAQs</Link>
          </nav>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900">Sign In</button>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}