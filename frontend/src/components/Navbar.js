import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-gold text-xl">◆</span>
          <span className="font-bold text-lg tracking-wide">OSKAR</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-900 text-sm">Shop</Link>
          <Link to="/services" className="text-gray-600 hover:text-gray-900 text-sm">Services</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">About</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">♡</button>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">🛒</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-700 hover:text-yellow-700">Hi, {user.first_name}</Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gold text-white px-5 py-2 rounded text-sm font-medium hover:bg-gold-hover transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;