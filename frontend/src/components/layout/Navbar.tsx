import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };

    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-purple-600">E-Commerce</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center">
            <Link to="/cart" className="p-2 text-gray-600 hover:text-purple-600">
              <FaShoppingCart className="h-6 w-6" />
            </Link>

            {isAuthenticated ? (
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-purple-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 