import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  soldCount: number;
  discount?: number;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 2500000,
    image: "https://via.placeholder.com/300x300",
    rating: 4.5,
    soldCount: 1200,
    discount: 15
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    price: 2800000,
    image: "https://via.placeholder.com/300x300",
    rating: 4.8,
    soldCount: 950
  },
  // Add more sample products...
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'shoes', 'clothing', 'accessories', 'electronics'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-600">
            Shop the latest trends with unbeatable prices
          </p>
        </motion.div>

        {/* Filters Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 text-purple-600"
          >
            <FaFilter />
            <span>Filters</span>
          </button>

          <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </div>

              {/* Price Range */}
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-32 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  Up to {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(priceRange[1])}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {sampleProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="mb-2">
                  <span className="text-xl font-bold text-red-500">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price * (1 - (product.discount || 0) / 100))}
                  </span>
                  {product.discount && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.soldCount} sold
                  </span>
                </div>
                
                <motion.button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md hover:from-purple-700 hover:to-indigo-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Products; 