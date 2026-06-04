const db = require('../db');

// GET /api/category
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM category ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/category/:id
const getCategoryById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM category WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/category (admin only)
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });
  try {
    const [result] = await db.query(
      'INSERT INTO category (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ message: 'Category created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/category/:id (admin only)
const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE category SET name = ?, description = ? WHERE id = ?',
      [name, description || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/category/:id (admin only)
const deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM category WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };