'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarDaysCalculated} from '@/components/icons';
import { XSquare  } from "lucide-react";


export default function PhotographerProfilePage() {
  // Static mock data (you'll replace this with API data later)
  const photographer = {
    image: '/images/portfolio_1.png', // Make sure this exists in your public folder or replace with a valid image URL
    name: 'Michael Peterson',
    title: 'Senior Photographer',
    status: 'Available',
    email: 'michaelp@email.com',
    phone: '+1 (555) 987-6543',
    location: 'Dubai UAE',
  };

  const statusColors: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-4 space-y-4">
    <div className='p-6 bg-white border border-b rounded-lg'>
<div className="flex flex-col gap-2 w-full">
  {/* Image centered at the top */}
  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
    <Image
      src={photographer.image}
      alt={photographer.name}
      width={80}
      height={80}
      className="object-cover w-full h-full"
    />
  </div>

  {/* Name and Status on same line */}
  <div className="flex items-center justify-between w-full">
    <h2 className="text-base font-semibold text-gray-800">
      {photographer.name}
    </h2>
    <div
      className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[photographer.status] || 'bg-gray-100 text-gray-700'}`}
    >
      {photographer.status}
    </div>
  </div>

  {/* Title below */}
  <p className="text-sm text-gray-500">{photographer.title}</p>
</div>


      

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-gray-700 py-5 border-t border-b border-[#DBDCDF]">
        <div>
          <p className="text-xs text-gray-500 mb-1">Email</p>
          <p>{photographer.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Phone</p>
          <p>{photographer.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <p>{photographer.location}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <button 
            className="basis-3/4 text-sm justify-center flex items-center gap-2 px-4 py-2 border border-[#DBDCDF] rounded-lg text-gray-700 hover:bg-gray-50 shadow-[inset_0_1.5px_0_0_#FFFFFF7A,inset_-1.5px_0_0_0_#FFFFFF33,inset_1.5px_0_0_0_#FFFFFF33,inset_0_-2px_0_0_#00000040]"
          >
            <CalendarDaysCalculated color="black" className="h-4 w-4" />
            Assign Booking
        </button>
        <button className="basis-1/4 text-sm justify-center flex items-center gap-2 px-4 py-2 text-[#CC3A30] border border-[#F9AFA9] rounded-lg hover:bg-gray-50 shadow-[inset_0_1.5px_0_0_#FFFFFF7A,inset_-1.5px_0_0_0_#FFFFFF33,inset_1.5px_0_0_0_#FFFFFF33,inset_0_-2px_0_0_#00000040]">
          <XSquare className="h-4 w-4" /> 
            Suspend Account
        </button>
      </div>
      
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#DBDCDF]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-[#DBDCDF]">Portfolio</h3>

        <div className="flex overflow-x-auto space-x-4">
            {["/images/portfolio_1.png", "/images/portfolio_2.png", "/images/portfolio_3.png"].map((src, index) => (
            <div key={index} className="min-w-[240px] h-[240px] rounded-lg overflow-hidden   flex-shrink-0">
                <img
                src={src}
                alt={`Portfolio Image ${index + 1}`}
                className="w-full h-full object-cover"
                />
            </div>
            ))}
        </div>
        </div>
    </div>
  );
}
