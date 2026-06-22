import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const emptyForm = { name: '', description: '', price: '', stock_quantity: '', category_id: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id || '',
    });
    setEditingId(product.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError('Name and price are required');
      return;
    }
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, form);
      } else {
        await API.post('/products', form);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalogue</p>
          </div>
          <button
            onClick={openCreateForm}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            + Add Product
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{editingId ? 'Edit Product' : 'New Product'}</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Price *</label>
                <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Stock Quantity</label>
                <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select name="category_id" value={form.category_id} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600">
                  <option value="">None</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit}
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded-lg text-sm font-medium transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading products...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Price</th>
                  <th className="text-left px-5 py-3">Stock</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.category_name || '—'}</td>
                    <td className="px-5 py-3 text-yellow-700 font-medium">€ {parseFloat(p.price).toFixed(2)}</td>
                    <td className="px-5 py-3 text-gray-500">{p.stock_quantity}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEditForm(p)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;