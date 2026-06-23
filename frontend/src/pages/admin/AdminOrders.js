import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Orders</h1>
        <p className="text-sm text-gray-500 mb-6">Manage customer orders</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">{order.first_name} {order.last_name} — {order.email}</p>
                    <p className="text-xs text-gray-400">{new Date(order.order_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">📍 {order.delivery_address}</p>
                <p className="text-xs text-gray-500 mb-3">💳 {order.payment_method}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-yellow-700">€ {parseFloat(order.total_price).toFixed(2)}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-600">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
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

export default AdminOrders;