"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { IS_AUTHENTICATION_ACTIVE } from '@/constants/is-authentication-active.constant';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const authRedirect = (page: string, e: any) => {
    window.location.assign(`/auth/${page}`);
  }

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/icons/logo.svg" alt="" />
              <span className="ml-2 text-xl font-semibold">Surface Planner</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</Link>
            <Link href="/packages" className="text-gray-600 hover:text-gray-900">Packages</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link>
            <Link href="/faqs" className="text-gray-600 hover:text-gray-900">FAQs</Link>
          </div>

          {IS_AUTHENTICATION_ACTIVE ? (
            <div className="hidden md:flex items-center space-x-8">
              <Button onClick={(event: any) => { authRedirect('login', event) }} variant="outline" className="rounded-xl">Sign In</Button>
              <Button onClick={(event: any) => { authRedirect('signup', event) }} className="rounded-xl border-2 border-solid border-[#ffffff70] bg-[#0F553E] hover:bg-[#0F553E]/90">Sign Up</Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              <Button onClick={(event: any) => { window.location.assign('/booking'); }} className="rounded-xl border-2 border-solid border-[#ffffff70] bg-[#0F553E] hover:bg-[#0F553E]/90">Get a Quote</Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/portfolio" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Portfolio</Link>
            <Link href="/packages" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Packages</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact Us</Link>
            <Link href="/faqs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">FAQs</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {IS_AUTHENTICATION_ACTIVE ? (
              <div className="flex flex-col space-y-3 px-3">
                <Button onClick={(event: any) => { authRedirect('login', event) }} variant="outline" className="w-full rounded-xl">Sign In</Button>
                <Button onClick={(event: any) => { authRedirect('signup', event) }} className="w-full rounded-xl border-2 border-solid border-[#ffffff70] bg-[#0F553E] hover:bg-[#0F553E]/90">Sign Up</Button>
              </div>
            ) : (
              <div className="px-3">
                <Button onClick={(event: any) => { window.location.assign('/booking'); }} className="w-full rounded-xl border-2 border-solid border-[#ffffff70] bg-[#0F553E] hover:bg-[#0F553E]/90">Get a Quote</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}