
import './Photography.css';
export default function Photography() {

  const columns = [
    [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    ],
    [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
    ],
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">

          <p className="text-[#B08968] font-medium">Photography</p>
          <h2 className="text-4xl font-bold mb-4">Stunning Photography Tailored for Real Estate</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Capture every angle with professional, high-resolution images enhanced with blue sky
            replacement, object removal, and optimal lighting.
          </p>
        </div>


        <div className='sm:hidden grid grid-cols-2 w-full p-4 rounded-lg gap-4 bg-[#0F553E70]'>
          <div className='flex flex-col gap-2 col-span-1'>
              <img className='rounded-lg h-[160px]' src="/images/mobile/photography-1.png" />
              <img className='rounded-lg h-[160px]' src="/images/mobile/photography-2.png" />
          </div>
          <div className='flex flex-col col-span-1 justify-between'>
          <img className='rounded-lg h-[100px] w-auto' src="/images/mobile/photography-3.png" />
          <img className='rounded-lg h-[100px] w-auto' src="/images/mobile/photography-4.png" />
          <img className='rounded-lg h-[100px] w-auto' src="/images/mobile/photography-5.png" />

          </div>
        </div>



        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((images, columnIndex) => (
            <div key={columnIndex} className="image-column overflow-hidden rounded-lg shadow-xl">




              <div className="wrapper">
                <div className="images-wrapper">
                  {images.map((image, imageIndex) => (
                    <div key={imageIndex} className="image-wrapper">
                      <img
                        src={image}
                        alt={`Real estate interior ${columnIndex}-${imageIndex}`}
                        className="spinner-image w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>




            </div>
          ))}
        </div>
      </div>
    </section>
  );
}