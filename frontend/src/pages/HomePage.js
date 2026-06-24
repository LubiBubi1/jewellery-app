import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories'),
        ]);
        setProducts(productsRes.data.slice(0, 4));
        setCategories(categoriesRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch homepage data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 mx-6 mt-6 rounded-2xl overflow-hidden">
        <div className="px-12 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white max-w-lg mb-8 md:mb-0">
            <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase mb-3">New Collection 2026</p>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Handcrafted Jewellery<br />for Every Occasion
            </h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Discover our exclusive collection of rings, necklaces, bracelets and earrings,
              crafted with the finest materials and timeless design.
            </p>
            <div className="flex gap-3">
              <Link to="/products"
                className="bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition">
                Shop Now
              </Link>
              <Link to="/services"
                className="border border-gray-600 text-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg text-sm font-medium transition">
                Our Services
              </Link>
            </div>
          </div>
          <div className="w-64 h-64 bg-gray-800 rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-yellow-700 text-8xl">◆</span>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Shop by Category</h3>
          <Link to="/products" className="text-sm text-yellow-700 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.length > 0 ? categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category_id=${cat.id}`}
              className="bg-gray-50 border border-gray-100 rounded-xl h-24 flex flex-col items-center justify-center hover:bg-yellow-50 hover:border-yellow-200 transition group">
              <span className="text-yellow-700 text-xl mb-1">◆</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">{cat.name}</span>
            </Link>
          )) : (
            ['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((name) => (
              <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl h-24 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">{name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
          <Link to="/products" className="text-sm text-yellow-700 hover:underline">See more →</Link>
        </div>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <Link to={`/products/${product.id}`} key={product.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition block">
                <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-3">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-yellow-700 text-3xl">◆</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800">{product.name}</p>
                {product.category_name && (
                  <p className="text-xs text-gray-400 mt-1">{product.category_name}</p>
                )}
                <p className="text-sm text-yellow-700 font-semibold mt-1">€ {parseFloat(product.price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-8">Why Choose Oskar?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✦', title: 'Handcrafted Quality', desc: 'Every piece is carefully crafted by skilled artisans using the finest materials.' },
              { icon: '◆', title: 'Certified Authentic', desc: 'All our jewellery comes with certificates of authenticity and quality guarantee.' },
              { icon: '♡', title: 'Free Customisation', desc: 'We offer personalisation services to make your jewellery truly unique.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <span className="text-yellow-700 text-2xl block mb-3">{item.icon}</span>
                <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-yellow-700 text-lg">◆</span>
            <span className="font-bold text-gray-800 text-sm">OSKAR</span>
            <span className="ml-2">© 2026 Oskar Jewellery. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-gray-800 hover:underline">About</Link>
            <Link to="/products" className="hover:text-gray-800 hover:underline">Shop</Link>
            <Link to="/services" className="hover:text-gray-800 hover:underline">Services</Link>
            <Link to="/about" className="hover:text-gray-800 hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;