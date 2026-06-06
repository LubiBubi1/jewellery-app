import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyRequestsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
    const fetchRequests = async () => {
      try {
        const res = await API.get('/service-requests/my');
        setRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, navigate]);

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Service Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Track the status of your requests</p>
          </div>
          <button
            onClick={() => navigate('/services/request')}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            New Request
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400 text-lg mb-3">No service requests yet</p>
            <button
              onClick={() => navigate('/services/request')}
              className="text-sm text-yellow-700 hover:underline">
              Submit your first request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{req.service_name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted on {new Date(req.request_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(req.status)}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                {req.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{req.description}</p>
                )}
                {req.price && (
                  <p className="text-sm text-yellow-700 font-medium mt-3">€ {parseFloat(req.price).toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;