const db = require('../db');

// GET /api/products (with optional filters)
const getProducts = async (req, res) => {
  try {
    const { search, category_id, min_price, max_price } = req.query;
    let query = 'SELECT p.*, c.name AS category_name FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (min_price) {
      query += ' AND p.price >= ?';
      params.push(min_price);
    }
    if (max_price) {
      query += ' AND p.price <= ?';
      params.push(max_price);
    }

    query += ' ORDER BY p.created_at DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/product/:id
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT p.*, c.name AS category_name FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/product (admin only)
const createProduct = async (req, res) => {
  const { name, description, price, stock, category_id, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });
  try {
    const [result] = await db.query(
      'INSERT INTO product (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, stock || 0, category_id || null, image_url || null]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/product/:id (admin only)
const updateProduct = async (req, res) => {
  const { name, description, price, stock, category_id, image_url } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE product SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description || null, price, stock || 0, category_id || null, image_url || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/product/:id (admin only)
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM product WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };