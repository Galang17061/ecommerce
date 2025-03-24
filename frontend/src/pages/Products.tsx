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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-purple-600">E-Commerce</h1>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Shop</a>
            <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
          </nav>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-xs bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Products</h2>
          <p className="text-xl mb-8">Shop the latest trends with unbeatable prices and exclusive deals</p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-full shadow-md hover:bg-gray-100">Shop Now</button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <div key={category} className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-2">
                <FaShoppingCart className="text-purple-600 text-2xl" />
              </div>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-indigo-50'
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
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
                        <span className="text-lg font-bold text-indigo-600">
                          Rp {(product.price * (1 - product.discount / 100)).toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          Rp {product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-indigo-600">
                        Rp {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">About Us</h3>
              <p className="text-sm">Learn more about our company and values.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Customer Service</h3>
              <p className="text-sm">Contact us for support and inquiries.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products; 