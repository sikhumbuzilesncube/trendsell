import Link from 'next/link'
import Image from 'next/image'

// Dummy data for now - we'll connect Supabase later
const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 13 128GB',
    price: 250,
    location: 'Bulawayo CBD',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    tag: 'Featured',
    tagColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Nike Air Jordan 1 Low',
    price: 45,
    location: 'Hillside',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    tag: 'New',
    tagColor: 'bg-green-500'
  },
  {
    id: 3,
    name: 'HP Laptop i5 8GB RAM',
    price: 180,
    location: 'Queens Park',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    tag: 'Hot',
    tagColor: 'bg-red-500'
  },
]

export default function FeaturedSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            🔥 Trending in Bulawayo
          </h2>
          <Link 
            href="/products" 
            className="text-blue-600 font-semibold hover:text-blue-800"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className={`absolute top-3 left-3 ${product.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {product.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                    📍 {product.location}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">${product.price} USD</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                      ✅ Escrow Protected
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
      }
