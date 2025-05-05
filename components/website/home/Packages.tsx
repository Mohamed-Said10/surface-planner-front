'use client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const packages = [
  {
    id: 1,
    name: 'Silver Package',
    price: '600 AED',
    priceDetails: {
      base: 'Up to 1000 sq/ft,',
      extra: '+0.1 AED',
      unit: 'per extra sq/ft'
    },
    description: 'Perfect for basic real estate listings.',
    features: [
      '12 High-Quality Photos (Blue Sky Enhancement, Object Removal)',
      '3 AI Room Staging Photos',
      '2D Floor Plan',
      'AI Listing Creation'
    ]
  },
  {
    id: 2,
    name: 'Gold Package',
    price: '1100 AED',
    priceDetails: {
      base: 'Up to 1000 sq/ft,',
      extra: '+0.15 AED',
      unit: 'per extra sq/ft'
    },
    description: 'Great for engaging property presentations.',
    features: [
      '18 High-Quality Photos',
      '7 AI Room Staging Photos',
      '2D Floor Plan',
      'AI Listing Creation',
      '1-2 Minute Video Tour'
    ],
    popular: true
  },
  {
    id: 3,
    name: 'Diamond Package',
    price: '1600 AED',
    priceDetails: {
      base: 'Up to 1000 sq/ft,',
      extra: '+0.2 AED',
      unit: 'per extra sq/ft'
    },
    description: 'The ultimate package for high-end listings.',
    features: [
      '30 High-Quality Photos',
      '20 AI Room Staging Photos',
      '2D & 3D Floor Plan',
      'AI Listing Creation',
      'Full 2-4 Minute Video Tour',
      '360° Virtual Tour'
    ]
  }
];

const addOns = [
  { name: '5 Photos', price: '165 AED', icon: 'image.svg' },
  { name: '10 Photos', price: '300 AED', icon: 'image.svg' },
  { name: '15 Photos', price: '400 AED', icon: 'image.svg' },
  { name: 'Video 1-2 mins', price: '400 AED', icon: 'camera.svg' },
  { name: 'Video 2-4 mins', price: '700 AED', icon: 'camera.svg' },
  { name: '360° Virtual Tour', price: '900 AED', icon: 'bed.svg' }
];
const handleSelectPackage = (packageObj: any) =>{
  console.log('package: ', packageObj);
  window.location.assign(`/booking?p=${packageObj.id}`);
}
export default function Packages() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#B08968] font-medium">Packages</p>
          <h2 className="text-3xl font-bold mt-2">Choose the Perfect Package for Your Needs</h2>
          <p className="text-gray-600 mt-4">
            Select from flexible pricing plans designed to showcase your property in the best light.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-8 ${pkg.popular
                ? 'bg-[#0F553E]/5 border-2 border-[#0F553E]'
                : 'bg-white border border-gray-200'
                }`}
            >
              <div className='flex justify-between flex-col h-[100%]'>
                <div>
                  {pkg.popular && (
                    <span className="inline-block bg-[#0F553E] text-white text-sm px-3 py-1 rounded-full mb-4 absolute top-[0px] -translate-y-1/2 left-1/2 -translate-x-1/2 ">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {pkg.priceDetails.base} <br /> <b className='text-black'>{pkg.priceDetails.extra}</b> {pkg.priceDetails.unit}
                    </p>
                  </div>
                  <hr className="bg-gray-500 h-[1px] width-[100%] mt-4" />

                  <p className="text-gray-600 mt-4">{pkg.description}</p>
                  <ul className="mt-8 space-y-4">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-[#0F553E] mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full mt-8 ${pkg.popular
                    ? 'bg-[#0F553E] hover:bg-[#0F553E]/90'
                    : 'bg-white border-2 border-[#0F553E] text-[#0F553E] hover:bg-gray-50'
                    }`}
                  onClick={() => {
                    handleSelectPackage(pkg)
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg px-6 py-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Add-ons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white col-span-2 p-2 rounded-lg text-center flex items-center justify-between">
                <div className='flex items-center'>
                  <img src={`/icons/${addon.icon}`} className='mr-2' alt="" />
                  <p className="font-medium">{addon.name}</p>
                </div>
                <p className="text-[#2F4F4F] font-bold mt-1">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}