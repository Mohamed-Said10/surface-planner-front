"use client";

import { useState } from "react";
import { Check, Calendar, HelpCircle, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const bookingStatus = {
  id: "1279486",
  steps: [
    { label: "Booking Requested", date: "May 5, 5:54 AM", completed: true },
    { label: "Photographer Assigned", date: "May 5, 8:54 AM", completed: true },
    { label: "Shoot in Progress", date: "May 5, 8:54 AM", completed: true },
    { label: "Editing", date: "Currently", completed: true, inProgress: false },
    { label: "Order Delivery", date: "Expected May 8, 2025", completed: true }
  ]
};

const bookingDetails = {
  package: "Diamond Package",
  addons: "Extra Fast Delivery Service",
  propertyAddress: "103 Al Lu'lu Street, Jumeirah 3, Dubai",
  scheduledDateTime: "Feb 12, 2025 6:23 am",
  photographer: {
    name: "Courtney Henry",
    email: "michaelp@email.com",
    phone: "+1 (555) 987-6543",
    location: "Dubai UAE"
  }
};

const images = [
  {
    id: 1,
    image: '/images/portfolio_1.png',
    category: 'Photography'
  },
  {
    id: 2,
    image: '/images/portfolio_2.png',
    category: 'Photography'
  },
  {
    id: 3,
    image: '/images/portfolio_3.png',
    category: 'Photography'
  },
  {
    id: 4,
    image: '/images/portfolio_4.png',
    category: 'Photography'
  },
  {
    id: 5,
    image: '/images/portfolio_5.png',
    category: 'Photography'
  }
];

export default function ProjectDetailsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Photographer Details */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Booking#{bookingStatus.id} Status</h2>
          <span className={`px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800`}>
            Completed
          </span>
        </div>

        <hr className="h-1 bg-red mb-2" />
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs text-gray-500">Included Services</h3>
            <p className="text-sm">Photos + 360° Virtual Tour</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Date & time</h3>
            <p className="text-sm">{bookingDetails.scheduledDateTime}</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Photographer Assigned</h3>
            <p className="text-sm">{bookingDetails.photographer.name}</p>
          </div>
          <div>
            <h3 className="text-xs text-gray-500">Price</h3>
            <p className="text-sm">AED 270.00</p>
          </div>
        </div>
      </div>

      {/* Booking Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-semibold mb-6">Status</h2>
        <div className="relative grid justify-between grid-cols-5">
          {bookingStatus.steps.map((step, index) => (
            <div key={index} className="col-span-1 flex flex-col items-left text-left relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 
                      ${step.completed ? 'bg-emerald-500' : step.inProgress ? 'bg-orange-500' : 'bg-gray-200'}`}>
                {step.completed ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div className="text-xs font-medium">{step.label}</div>
              <div className="text-xs text-gray-500">{step.date}</div>
            </div>
          ))}
          {/* Progress Lines */}
          <div className="absolute top-3 left-0 w-full h-[2px] flex">
            <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
            <div className="h-full bg-emerald-500" style={{ width: '15%' }} />
            <div className="h-full bg-emerald-500" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold">Delivery</h2>
      {/* Photographer Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Photos</h2>
          <a className={`px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800`}>
            Download All Photos
          </a>
        </div>

        <hr className="h-1 bg-red mb-2" />
        <div className="flex gap-4">
          {images.map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt={`Portfolio item ${item.id}`}
              className="rounded-lg h-[100px] w-[100px] object-cover object-center transition duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index);
                setIsOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Videos</h2>
          <span className={`px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800`}>
            Download All Videos
          </span>
        </div>

        <hr className="h-1 bg-red mb-2" />
        <div className="flex gap-4">
          {images.map((item) => (
            <img
              key={item.id}
              src={item.image}
              alt={`Portfolio item ${item.id}`}
              className="rounded-lg h-[100px] w-[100px] object-cover object-center transition duration-300 group-hover:scale-105"
            />
          ))}
        </div>
      </div>

      {/* Image Carousel Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative h-[80vh] flex items-center justify-center">
            <button
              onClick={previousImage}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <img
              src={images[currentImageIndex].image}
              alt={`Portfolio item ${images[currentImageIndex].id}`}
              className="max-h-full max-w-full object-contain"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}