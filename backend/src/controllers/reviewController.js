const db = require('../db');

// POST /api/reviews — submit a review
const createReview = async (req, res) => {
  const { rating, comment, product_id, service_id } = req.body;
  const user_id = req.user.id;

  if (!rating) return res.status(400).json({ message: 'Rating is required' });
  if (!product_id && !service_id) return res.status(400).json({ message: 'Product or service is required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  try {
    const [result] = await db.query(
      'INSERT INTO review (rating, comment, user_id, product_id, service_id) VALUES (?, ?, ?, ?, ?)',
      [rating, comment || null, user_id, product_id || null, service_id || null]
    );
    res.status(201).json({ message: 'Review submitted', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/reviews?product_id=X — get reviews for a product
const getReviews = async (req, res) => {
  const { product_id, service_id } = req.query;
  try {
    let query = 'SELECT r.*, u.first_name, u.last_name FROM review r LEFT JOIN user u ON r.user_id = u.id WHERE 1=1';
    const params = [];

    if (product_id) {
      query += ' AND r.product_id = ?';
      params.push(product_id);
    }
    if (service_id) {
      query += ' AND r.service_id = ?';
      params.push(service_id);
    }

    query += ' ORDER BY r.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/reviews/all — get all reviews (admin)
const getAllReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT r.*, u.first_name, u.last_name, p.name AS product_name FROM review r LEFT JOIN user u ON r.user_id = u.id LEFT JOIN product p ON r.product_id = p.id ORDER BY r.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/reviews/:id — delete a review (admin)
const deleteReview = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM review WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createReview, getReviews, getAllReviews, deleteReview };