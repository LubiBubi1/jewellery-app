import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
  if (!user && !authLoading) {
    navigate('/login');
    return;
  }
  if (!user) return;
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
    });
    fetchOrders();
    fetchRequests();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get('/service-requests/my');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await API.put('/auth/me', form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">My Account</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, orders and requests</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['profile', 'orders', 'requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition ${
                activeTab === tab ? 'border-yellow-700 text-yellow-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab === 'orders' ? 'Order History' : tab === 'requests' ? 'Service Requests' : 'Profile'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
            {success && <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
              <input
                type="text" name="first_name" value={form.first_name} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
              <input
                type="text" name="last_name" value={form.last_name} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="text" value={user.email} disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="text" name="phone" value={form.phone} onChange={handleChange}
                placeholder="Optional"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <p className="text-gray-400 text-sm">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-2">No orders yet</p>
                <Link to="/products" className="text-sm text-yellow-700 hover:underline">Browse products</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
                        <p className="text-xs text-gray-400">{new Date(order.order_date).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-2">
                      {order.items && order.items.map((item) => (
                        <p key={item.id}>{item.name} × {item.quantity}</p>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-yellow-700">€ {parseFloat(order.total_price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {requestsLoading ? (
              <p className="text-gray-400 text-sm">Loading requests...</p>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-2">No service requests yet</p>
                <Link to="/services" className="text-sm text-yellow-700 hover:underline">Browse services</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-800">{req.service_name}</p>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{new Date(req.request_date).toLocaleDateString()}</p>
                    {req.description && <p className="text-sm text-gray-600">{req.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;