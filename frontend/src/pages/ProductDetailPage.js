import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-sm text-yellow-700 hover:underline">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back button */}
        <button onClick={() => navigate('/products')} className="text-sm text-yellow-700 hover:underline mb-6 block">
          ← Back to products
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row gap-10">
          {/* Image */}
          <div className="w-full md:w-96 shrink-0">
            <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
              ) : (
                <span className="text-gray-400 text-sm">No image available</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            {product.category_name && (
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{product.category_name}</p>
            )}
            <h1 className="text-2xl font-semibold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-2xl text-yellow-700 font-bold mb-5">€ {parseFloat(product.price).toFixed(2)}</p>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Availability</h3>
              {product.stock_quantity > 0 ? (
                <span className="text-sm text-green-600 font-medium">In stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of stock</span>
              )}
            </div>

            <button
              onClick={() => addToCart(product)}
              className="bg-yellow-700 hover:bg-yellow-800 text-white px-8 py-3 rounded-lg text-sm font-medium transition">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;