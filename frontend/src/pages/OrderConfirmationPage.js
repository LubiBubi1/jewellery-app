import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-500 text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-sm text-gray-500 mb-2">Thank you for your order.</p>
        <p className="text-sm text-gray-400 mb-8">Order #{id}</p>

        <div className="space-y-3">
          <Link to="/products"
            className="block w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-sm font-medium transition">
            Continue Shopping
          </Link>
          <Link to="/"
            className="block w-full text-sm text-gray-400 hover:text-gray-600 py-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;