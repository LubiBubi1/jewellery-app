import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }
    if (!agreed) {
      return setError('Please agree to the Terms & Privacy Policy');
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-yellow-700 font-medium mb-8">Join Oskar to shop & track your orders</p>

        <div className="bg-gray-100 rounded-xl p-8 w-full max-w-lg">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Ljupcho"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Bozhinov"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="••••••••"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">I agree to the Terms & Privacy Policy</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-sm font-medium transition"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;