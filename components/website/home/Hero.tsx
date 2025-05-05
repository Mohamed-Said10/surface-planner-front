"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function Hero() {
  const [propertySize, setPropertySize] = useState('1200');
  const [propertyType, setPropertyType] = useState('1');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.assign(`/booking?t=${propertyType}&s=${propertySize}`)
  };

  return (
    <div className="relative min-h-[600px] bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="text-white lg:col-span-3">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Property Listings with SurfacePlanner
            </h1>
            <p className="text-xl mb-8">Boost Your Listing's Appeal</p>
            <div className="flex flex-wrap gap-4">
              <Button className="rounded-full py-1 h-auto px-2 bg-white/30 text-white hover:bg-white/30 cursor-default">
                Photography
              </Button>
              <Button className="rounded-full py-1 h-auto px-2 bg-white/30 text-white hover:bg-white/30 cursor-default">
                Video Tours
              </Button>
              <Button className="rounded-full py-1 h-auto px-2 bg-white/30 text-white hover:bg-white/30 cursor-default">
                Virtual Tour
              </Button>
              <Button className="rounded-full py-1 h-auto px-2 bg-white/30 text-white hover:bg-white/30 cursor-default">
                2D/3D Floor Plan
              </Button>
              <Button className="rounded-full py-1 h-auto px-2 bg-white/30 text-white hover:bg-white/30 cursor-default">
                AI-Powered Room Staging
              </Button>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 shadow-xl lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Get your Quote</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Select Property Type</label>
                <select 
                  id="property-type" 
                  value={propertyType} 
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="1">Apartment</option>
                  <option value="3">Villa</option>
                  <option value="4">Office</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Size</label>
                <div className="flex gap-2">
                  <div className="px-3 py-2 rounded-lg text-sm bg-white">SqFt</div>
                  <Input
                    type="text"
                    value={propertySize}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                      setPropertySize(e.target.value)
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type='submit' className="w-full bg-[#0F553E] hover:bg-[#0F553E]/90">
                Get a Quote
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}