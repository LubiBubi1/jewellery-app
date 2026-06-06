import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
        <Link to="/products" className="text-sm text-yellow-700 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Your Cart</h1>
          <p className="text-sm text-gray-500 mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {cartItems.map((item, index) => (
              <div key={item.id} className={`flex items-center gap-4 p-5 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {/* Image placeholder */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-xs text-gray-400">No img</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-yellow-700 mt-1">€ {parseFloat(item.price).toFixed(2)}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                    −
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-semibold text-gray-800 w-20 text-right">
                  € {(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-300 hover:text-red-400 text-lg ml-2">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button onClick={clearCart} className="mt-3 text-xs text-gray-400 hover:text-red-400">
            Clear cart
          </button>
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
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg text-sm font-medium transition">
              Proceed to Checkout
            </button>

            <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;