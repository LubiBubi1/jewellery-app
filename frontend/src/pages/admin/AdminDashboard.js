import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    services: 0,
    orders: 0,
    pendingOrders: 0,
    serviceRequests: 0,
    pendingRequests: 0,
    reviews: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, categories, services, orders, requests, reviews, users] = await Promise.all([
        API.get('/products'),
        API.get('/categories'),
        API.get('/services'),
        API.get('/orders'),
        API.get('/service-requests'),
        API.get('/reviews/all'),
        API.get('/users'),
      ]);

      setStats({
        products: products.data.length,
        categories: categories.data.length,
        services: services.data.length,
        orders: orders.data.length,
        pendingOrders: orders.data.filter((o) => o.status === 'pending').length,
        serviceRequests: requests.data.length,
        pendingRequests: requests.data.filter((r) => r.status === 'pending').length,
        reviews: reviews.data.length,
        users: users.data.length,
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total Products', value: stats.products, link: '/admin/products', color: 'bg-blue-50 text-blue-700' },
    { label: 'Categories', value: stats.categories, link: '/admin/categories', color: 'bg-purple-50 text-purple-700' },
    { label: 'Services', value: stats.services, link: '/admin/services', color: 'bg-pink-50 text-pink-700' },
    { label: 'Total Orders', value: stats.orders, sub: `${stats.pendingOrders} pending`, link: '/admin/orders', color: 'bg-green-50 text-green-700' },
    { label: 'Service Requests', value: stats.serviceRequests, sub: `${stats.pendingRequests} pending`, link: '/admin/service-requests', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Reviews', value: stats.reviews, link: '/admin/reviews', color: 'bg-orange-50 text-orange-700' },
    { label: 'Registered Users', value: stats.users, link: '/admin/users', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <AdminLayout>
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">Overview of your jewellery store</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => (
              <Link to={card.link} key={card.label}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-3 ${card.color}`}>
                  {card.label}
                </div>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                {card.sub && <p className="text-xs text-gray-400 mt-1">{card.sub}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;