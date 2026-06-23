import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await API.get('/reviews/all');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  return (
    <AdminLayout>
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Reviews</h1>
        <p className="text-sm text-gray-500 mb-6">Moderate customer reviews</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{review.first_name} {review.last_name}</p>
                    <p className="text-xs text-gray-400">
                      {review.product_name && `on ${review.product_name}`} — {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= review.rating ? 'text-yellow-500' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </div>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;