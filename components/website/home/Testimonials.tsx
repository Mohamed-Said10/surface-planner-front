'use client';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
const testimonials = [
  {
    text: `The photos and video we received were outstanding. Our property looked
    so inviting! The photographer was professional, on time, and even
    suggested a few shots we hadn’t thought of. I’ll definitely use this service
    again.`,
    author: "Amira M.",
    role: "Agency Owner",
    rating: 5
  },
  {
    text: `I had a last-minute listing and booked with less than 24h notice. They still
    managed to shoot and deliver everything within 2 days. Saved my deal.`,
    author: "Yousef A.",
    role: "Senior Broker",
    rating: 5
  },
  {
    text: `I hate chasing media guys. With SurfacePlanner I book once and I’m
    done. It’s a relief honestly, especially when you’re multiple listings at
    once.`,
    author: "Selma K.",
    role: "Sales Manager",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[#B08968] font-medium">Customer Testimonials</p>
          <h2 className="text-3xl font-bold mt-2">
            Trusted by Real Estate Professionals & Property Owners
          </h2>
          <p className="text-gray-600 mt-4">
            See how SurfacePlanner has helped clients elevate their property listings with stunning visuals and seamless service.
          </p>
        </div>
        <Swiper
          slidesPerView={1.25}
          spaceBetween={30}
          freeMode={true}
          modules={[FreeMode]}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="bg-gray-50 p-6 rounded-lg" style={{height: 'auto'}}>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </SwiperSlide>

          ))}
        </Swiper>
      </div>
    </section>
  );
}