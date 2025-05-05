import { Home, Tag, Calendar, Download } from 'lucide-react';

const steps = [
  {
    icon: '/icons/house.svg',
    title: 'Enter Property Details',
    description: 'Choose property type, size, and requirements.'
  },
  {
    icon: '/icons/price.svg',
    title: 'Choose Your Package',
    description: 'Select from Silver, Gold, or Diamond packages.'
  },
  {
    icon: '/icons/calendar.svg',
    title: 'Schedule Your Session',
    description: 'Select a date and time for your shoot.'
  },
  {
    icon: '/icons/download.svg',
    title: 'Receive & Download',
    description: 'Get high-quality visuals in 24-48 hours.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#B08968] font-medium">How it Works</p>
          <h2 className="text-3xl font-bold mt-2">Effortless Booking, Stunning Results</h2>
          <p className="text-gray-600 mt-4">
            Get high-quality real estate visuals in just four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            return (
              <div key={index} className="p-8 rounded-lg text-center bg-gray-100">
                <div className="mx-auto h-16 w-16 bg-[#2F4F4F]/10 rounded-full flex items-center justify-center mb-4">
                  <img src={step.icon} alt=""/>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}