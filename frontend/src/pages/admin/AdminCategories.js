import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const emptyForm = { name: '', description: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
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

  const openEditForm = (category) => {
    setForm({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Name is required');
      return;
    }
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, form);
      } else {
        await API.post('/categories', form);
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category. It might be used by existing products.');
    }
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage product categories</p>
          </div>
          <button
            onClick={openCreateForm}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            + Add Category
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-lg">
            <h3 className="font-semibold text-gray-800 mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600" />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
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

        {loading ? (
          <p className="text-gray-400 text-sm">Loading categories...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-5 py-3 text-gray-500">{c.description || '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEditForm(c)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
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

export default AdminCategories;