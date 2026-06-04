import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, minPrice, maxPrice]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);

      const res = await API.get(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Our Collection</h1>
          <p className="text-sm text-gray-500 mt-1">Handcrafted jewellery for every occasion</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              <button onClick={clearFilters} className="text-xs text-yellow-700 hover:underline">Clear all</button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Price range (€)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-400 text-lg">No products found</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-yellow-700 hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition block">
                    <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;