import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        setError('Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">{error || 'Service not found'}</p>
        <button onClick={() => navigate('/services')} className="mt-4 text-sm text-yellow-700 hover:underline">
          Back to services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back button */}
        <button onClick={() => navigate('/services')} className="text-sm text-yellow-700 hover:underline mb-6 block">
          ← Back to services
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
            <span className="text-yellow-700 text-2xl">✦</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-2">{service.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl text-yellow-700 font-bold">€ {parseFloat(service.price).toFixed(2)}</span>
            {service.estimated_duration && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                ⏱ {service.estimated_duration}
              </span>
            )}
          </div>

          {service.description && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-2">About this service</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          )}

          <button
            onClick={() => navigate('/services/request')}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-8 py-3 rounded-lg text-sm font-medium transition">
            Request this service
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;