import { Button } from '@/components/ui/button';

const categories = [
  'Photography',
  'Video Tours',
  'Virtual Tours',
  'Floor Plans',
  'AI Room Staging'
];

const portfolioItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    category: 'Photography'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600607687644-c7f34c5a3613',
    category: 'Photography'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600607687920-4e03c0cdc276',
    category: 'Photography'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600607687854-fe5a129a5c5c',
    category: 'Photography'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600607687710-4f9c174478d6',
    category: 'Photography'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1600607687644-c7f34c5a3613',
    category: 'Photography'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    category: 'Photography'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1600607687920-4e03c0cdc276',
    category: 'Photography'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1600607687854-fe5a129a5c5c',
    category: 'Photography'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1600607687710-4f9c174478d6',
    category: 'Photography'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1600607687644-c7f34c5a3613',
    category: 'Photography'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    category: 'Photography'
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h3 className="text-base font-medium text-[#B08968]">Portfolio</h3>
            <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
              Explore Our Work
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Browse through completed projects to see the quality and creativity SurfacePlanner brings to every property.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-4 justify-start mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className={`rounded-full px-6 py-2 text-sm ${
                category === 'Photography'
                  ? 'bg-[#2F4F4F] text-white hover:bg-[#2F4F4F]/90'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={item.image}
                  alt={`Portfolio item ${item.id}`}
                  className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="rounded-full px-8 py-2 text-gray-600 hover:bg-gray-100"
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}