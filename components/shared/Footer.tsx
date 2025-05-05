'use client';
import Link from 'next/link';
import { Layout } from 'lucide-react';
import { Input } from '../ui/input';
import { FormEventHandler, useState } from 'react';
import { Button } from '../ui/button';
import { sendEmail } from '@/helpers/send-email';

export default function Footer() {
  const [emailAddress, setEmailAddress] = useState('')
  const handleSubmit= async (e: any) => {
    e.preventDefault()
    console.log(emailAddress);
    const req = await sendEmail({ email: emailAddress }, 'newsletter')
    
    setEmailAddress('')
  }
  return (
    <footer className="bg-gray-50 py-16 pt-[120px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className='col-span-1'>
            <div className="flex items-center">

              <img src="/icons/logo.svg" alt="" />
              <span className="ml-2 text-xl font-semibold">Surface Planner</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Enhancing Property Listings with High-Quality Visuals & AI-Powered Features
            </p>
          </div>



          <div className='sm:grid col-span-3 gap-4 sm:gap-[100px] grid-cols-6'>
            <div className='order-2 sm:order-1  sm:col-span-3 flex justify-around sm:justify-between mb-4'>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="grid grid-cols-1 gap-2">
                  <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
                  <li><Link href="/packages" className="text-gray-500 hover:text-gray-700">Packages</Link></li>
                  <li><Link href="/portfolio" className="text-gray-500 hover:text-gray-700">Portfolio</Link></li>
                  <li><Link href="/contact" className="text-gray-500 hover:text-gray-700">Contact Us</Link></li>
                  <li><Link href="/faqs" className="text-gray-500 hover:text-gray-700">FAQs</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal & Policies</h3>
                <ul className="grid grid-cols-1 gap-2">
                  <li><Link href="/legal-policies/booking-policy" className="text-gray-500 hover:text-gray-700">Booking Policy</Link></li>
                  <li><Link href="/legal-policies/payments-and-refunds" className="text-gray-500 hover:text-gray-700">Payment & Refunds</Link></li>
                  <li><Link href="/legal-policies/terms-and-conditions" className="text-gray-500 hover:text-gray-700">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>







            <div className="bg-gray-100 rounded-lg p-6 shadow-xl col-span-3 sm:col-span-3 order-1 sm:order-2 mb-2">
              {/* <h2 className="text-2xl font-bold mb-6">Get updates and tips</h2> */}
              <p className="block text-sm mb-1">Get updates and tips - straight to your inbox</p>
              <form className="space-y-4" onSubmit={(e)=>handleSubmit(e)}>
                <div>
                  <div className="flex gap-2">
                    {/* <div className="px-3 py-2 rounded-lg text-sm bg-white">SqFt</div> */}
                    <Input
                      type="email"
                      value={emailAddress}
                      placeholder='Enter your email'
                      onChange={(e) => {
                        e.target.value = e.target.value;
                        setEmailAddress(e.target.value)
                      }}
                      required
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button type='submit' className="w-full bg-[#0F553E] hover:bg-[#0F553E]/90">
                  Subscribe
                </Button>
              </form>
            </div>



            
          </div>

        </div>
      </div>
    </footer>
  );
}