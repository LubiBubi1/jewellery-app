import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ServiceRequestPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
  if (!user && !loading) navigate('/login');
    const fetchServices = async () => {
      try {
        const res = await API.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services');
      }
    };
    fetchServices();
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.service_id) {
      setError('Please select a service');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/service-requests', form);
      setSuccess('Your service request has been submitted successfully!');
      setForm({ service_id: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Request a Service</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the form below and we'll get back to you</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-8">

          {success && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">Select Service *</label>
            <select
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600">
              <option value="">Choose a service...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — € {parseFloat(s.price).toFixed(2)} ({s.estimated_duration})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your item and what service you need..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-yellow-700 hover:bg-yellow-800 text-white px-8 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              onClick={() => navigate('/services')}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-medium transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;