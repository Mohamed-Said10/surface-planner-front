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
    image: '/images/portfolio_1.png',
    category: 'Photography'
  },
  {
    id: 2,
    image: '/images/portfolio_2.png',
    category: 'Video Tours'
  },
  {
    id: 3,
    image: '/images/portfolio_3.png',
    category: 'Video Tours'
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
  },
  // Add more portfolio items as needed
];

export default function Portfolio() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Explore Our Work</h2>
          <p className="mt-4 text-lg text-gray-500">
            Browse through completed projects to see the quality and creativity SurfacePlanner brings to every property.
          </p>
        </div>

        <div className="mt-12 flex justify-center space-x-4 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === 'Photography' ? 'default' : 'outline'}
              className={`mt-2 ${category === 'Photography' ? 'bg-[#0F553E]' : ''}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={`Portfolio item ${item.id}`}
                  className="object-cover object-center w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}