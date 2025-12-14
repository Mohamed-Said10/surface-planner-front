'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CalendarDaysCalculated } from '@/components/icons';
import { XSquare } from "lucide-react";
import { useParams } from 'next/navigation';

export interface Photographer {
  id: string;
  firstname: string;
  lastname: string;
  city: string;
  email: string;
  phoneNumber: string;
  jobs_done: number;
  role: string;
  image: string | null;
}

export default function PhotographerProfilePage() {
  const { id } = useParams();

  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPhotographer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Admin/photographers/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        const fetchedPhotographer = data.photographer ?? data.photographers?.[0];

        if (fetchedPhotographer) {
          setPhotographer(fetchedPhotographer);
        } else {
          setError("Photographer not found");
        }
      } catch (err) {
        setError("Failed to fetch photographer");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [id]);

  const statusColors: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!photographer) return <div className="p-6 text-gray-600">No photographer data</div>;

  const profileImage = photographer.image && photographer.image.trim() !== ""
    ? photographer.image
    : "/images/portfolio_1.png";

  return (
    <div className="p-4 gap-4 space-y-4">
      <div className='p-6 bg-white border border-b rounded-lg'>
        <div className="flex flex-col gap-3 w-full">
          <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden">
            <Image
              src={profileImage}
              alt={`${photographer.firstname} ${photographer.lastname}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex items-center justify-between w-full gap-2">
            <h2 className="text-base font-semibold text-gray-800">
              {photographer.firstname} {photographer.lastname}
            </h2>
            <div
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors['Available'] || 'bg-gray-100 text-gray-700'}`}
            >
              Available
            </div>
          </div>

          <p className="text-sm text-gray-500">{photographer.role}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-3 text-sm text-gray-700 py-5 border-t border-b border-[#DBDCDF]">
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p>{photographer.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p>{photographer.phoneNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p>{photographer.city}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
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
      <div className="bg-white pt-4 pr-4 pb-5 pl-4 gap-4 rounded-lg shadow-md border border-[#DBDCDF]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-[#DBDCDF] pb-3">Portfolio</h3>

        <div className="flex overflow-x-auto space-x-4">
          {["/images/portfolio_1.png", "/images/portfolio_2.png", "/images/portfolio_3.png"].map((src, index) => (
            <div key={index} className="min-w-[240px] h-[240px] rounded-lg overflow-hidden flex-shrink-0">
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
