import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Our Services</h1>
          <p className="text-sm text-gray-500 mt-1">Professional jewellery care and customisation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No services available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition block">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-yellow-700 text-xl">✦</span>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-semibold text-yellow-700">€ {parseFloat(service.price).toFixed(2)}</span>
                  {service.estimated_duration && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{service.estimated_duration}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;