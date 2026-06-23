import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

const AdminServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get('/service-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/service-requests/${id}/status`, { status });
      fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

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
    <AdminLayout>
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Service Requests</h1>
        <p className="text-sm text-gray-500 mb-6">Manage customer service requests</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-400 text-sm">No service requests yet</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{req.service_name}</p>
                    <p className="text-xs text-gray-400">{req.first_name} {req.last_name} — {req.email}</p>
                    <p className="text-xs text-gray-400">{new Date(req.request_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(req.status)}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                {req.description && <p className="text-sm text-gray-600 mb-3">{req.description}</p>}
                <div className="flex justify-end">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-600">
                    {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServiceRequests;