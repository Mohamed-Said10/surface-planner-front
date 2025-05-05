'use client';
import { Camera, Video, Cuboid as Cube, LayoutGrid as LayoutPlanGrid, Paintbrush } from 'lucide-react';
import { Slide } from 'react-slideshow-image';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
const slideStyles = {
  spanStyle: {
    padding: '20px',
    background: '#efefef',
    color: '#000000'
  },
  divStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '400px'
  },
  buttonStyle: {
    width: "30px",
    background: 'none',
    border: '0px'
  }
}
const properties = {
  prevArrow: <button style={{ ...slideStyles.buttonStyle }}> <img src="/icons/left-arrow.svg" alt="" /> </button>,
  nextArrow: <button style={{ ...slideStyles.buttonStyle }}> <img src="/icons/right-arrow.svg" alt="" /> </button>
}
const slideImages = [
  {
    url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
    caption: 'Slide 1'
  },
  {
    url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
    caption: 'Slide 2'
  },
  {
    url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
    caption: 'Slide 3'
  },
];



const services = [
  {
    icon: Video,
    title: 'Immersive Video Walkthroughs',
    description: 'Bring your listings to life with guided video tours that showcase the flow and ambiance of each property.',
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    },
    category: 'Video Tours'
  },
  {
    icon: LayoutPlanGrid,
    title: 'Professional 2D & 3D Floor Plans',
    description: 'Provide clear and accurate layouts, available in both 2D and 3D formats to enhance listings.',
    images: {
      before: 'images/2d-3d-plans-before.jpeg',
      after: 'images/2d-3d-plans-after.jpeg',
    },
    category: 'Floor Plans'
  },
  {
    icon: Paintbrush,
    title: 'AI Powered Room Staging',
    description: 'Showcase the full potential of each space with AI-generated furnishings and decor for empty rooms.',
    images: {
      before: 'images/ai-staging-before.jpeg',
      after: 'images/ai-staging-after.jpeg',
    },
    category: 'AI Room Staging'
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {services.map((service, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`} dir={index % 2 === 1 ? 'rtl' : 'ltr'}>
              <div className="relative">
                {service.category === 'Video Tours' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-12 h-12 bg-[#2F4F4F] rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                {service.category === 'Video Tours' ?
                  <img
                    src={service.thumbnail?.url || ''}
                    alt={service.title}
                    className="w-full h-[400px] object-cover rounded-lg"
                  /> :
                  <ImgComparisonSlider className='w-[100%]'>
                    <img className='h-[400px] w-[100%]' slot="first" src={service.images?.before} />
                    <img className='h-[400px] w-[100%]' slot="second" src={service.images?.after} />
                  </ImgComparisonSlider>
                }
              </div>
              <div className='text-left'>
                <p className="text-[#B08968] font-medium">{service.category}</p>
                <h2 className="mt-2 text-3xl font-bold">{service.title}</h2>
                <p className="mt-4 text-gray-600 text-lg">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}