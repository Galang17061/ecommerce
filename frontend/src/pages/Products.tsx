import React, { useState } from 'react';
import { FaSearch, FaFilter, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  soldCount: number;
  discount?: number;
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', 'Shoes', 'Clothing', 'Accessories', 'Electronics'];
  
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl animate-slide-up">
            Shop the latest trends with unbeatable prices and exclusive deals
          </p>
          <div className="relative max-w-2xl animate-fade-in">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-6 py-4 rounded-full text-gray-900 bg-white/95 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pl-12"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-primary-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FaFilter className="text-primary-600" />
          <span>Filters</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.discount}%
                  </div>
                )}
                <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white">
                  <FaHeart className="text-red-500" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center text-yellow-400">
                    <FaStar />
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{product.soldCount} sold</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount ? (
                      <>
                        <span className="text-lg font-bold text-primary-600">
                          Rp {(product.price * (1 - product.discount / 100)).toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          Rp {product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary-600">
                        Rp {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors duration-200">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products; 