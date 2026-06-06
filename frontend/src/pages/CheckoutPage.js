import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    delivery_address: '',
    payment_method: 'credit_card',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Your cart is empty</p>
        </div>
    );
  }
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.delivery_address) {
      setError('Please enter a delivery address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/orders', {
        items: cartItems,
        delivery_address: form.delivery_address,
        payment_method: form.payment_method,
      });
      clearCart();
      navigate(`/order-confirmation/${res.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your order</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-800 mb-5">Delivery Details</h2>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={user ? `${user.first_name} ${user.last_name}` : ''}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Address *</label>
              <textarea
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter your full delivery address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Payment Method</label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} × {item.quantity}</span>
                  <span>€ {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>€ {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {loading ? 'Placing order...' : 'Place Order'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 block">
              Back to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;