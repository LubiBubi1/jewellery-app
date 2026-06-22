import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/admin', label: 'Dashboard', icon: '◈' },
    { path: '/admin/products', label: 'Products', icon: '◆' },
    { path: '/admin/categories', label: 'Categories', icon: '▦' },
    { path: '/admin/services', label: 'Services', icon: '✦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/service-requests', label: 'Service Requests', icon: '✎' },
    { path: '/admin/reviews', label: 'Reviews', icon: '★' },
    { path: '/admin/users', label: 'Users', icon: '◯' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Access denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="px-6 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-yellow-700 text-xl">◆</span>
            <span className="font-bold text-lg tracking-wide text-gray-800">OSKAR</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition ${
                location.pathname === link.path
                  ? 'bg-yellow-50 text-yellow-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 mt-auto border-t border-gray-100 pt-4 absolute bottom-4 w-60">
          <div className="px-3 mb-2">
            <p className="text-sm font-medium text-gray-700">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;