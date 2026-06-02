import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Gold', icon: '💛' },
  { name: 'Silver', icon: '⬜' },
  { name: 'Watches', icon: '⌚' },
  { name: 'Diamonds', icon: '💎' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-100 mx-6 mt-6 rounded-xl h-48 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Hero image • featured piece + headline</h2>
          <Link
            to="/shop"
            className="mt-3 inline-block bg-yellow-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-800 transition"
          >
            Shop now
          </Link>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Shop by category</h3>
          <Link to="/shop" className="text-sm text-yellow-700 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="bg-gray-100 rounded-xl h-24 flex items-center justify-center hover:bg-gray-200 transition"
            >
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 mt-10 mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Featured products</h3>
          <Link to="/shop" className="text-sm text-yellow-700 hover:underline">See more →</Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {['Rose gold ring', 'Pearl necklace', 'Silver bracelet', 'Classic watch'].map((name, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-3">
                <span className="text-xs text-gray-400">product</span>
              </div>
              <p className="text-sm font-medium text-gray-800">{name}</p>
              <p className="text-sm text-yellow-700 mt-1">€ --</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <span>© 2026 Oskar Jewellery</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;