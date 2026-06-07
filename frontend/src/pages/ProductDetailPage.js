import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className="text-2xl focus:outline-none"
          type="button">
          <span className={(hover || value) >= star ? 'text-yellow-500' : 'text-gray-300'}>★</span>
        </button>
      ))}
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews?product_id=${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewForm.rating) {
      setReviewError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setReviewError('');
    try {
      await API.post('/reviews', { ...reviewForm, product_id: id });
      setReviewSuccess('Review submitted successfully!');
      setReviewForm({ rating: 0, comment: '' });
      fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/products')} className="text-sm text-yellow-700 hover:underline mb-6 block">
          ← Back to products
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row gap-10 mb-8">
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
            <p className="text-2xl text-yellow-700 font-bold mb-2">€ {parseFloat(product.price).toFixed(2)}</p>

            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium text-gray-700">{avgRating}</span>
                <span className="text-sm text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

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

        {/* Reviews Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Customer Reviews</h2>

          {/* Review Form */}
          {user ? (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Leave a Review</h3>

              {reviewSuccess && (
                <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{reviewSuccess}</div>
              )}
              {reviewError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{reviewError}</div>
              )}

              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Your Rating *</label>
                <StarRating value={reviewForm.rating} onChange={(val) => setReviewForm({ ...reviewForm, rating: val })} />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-600"
                />
              </div>

              <button
                onClick={handleReviewSubmit}
                disabled={submitting}
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <p className="text-sm text-gray-500">
                <button onClick={() => navigate('/login')} className="text-yellow-700 hover:underline">Sign in</button> to leave a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{review.first_name} {review.last_name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-500' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;