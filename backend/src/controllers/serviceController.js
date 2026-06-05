const db = require('../db');

// GET /api/services
const getServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM service ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM service WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Service not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/services (admin only)
const createService = async (req, res) => {
  const { name, description, price, estimated_duration } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });
  try {
    const [result] = await db.query(
      'INSERT INTO service (name, description, price, estimated_duration) VALUES (?, ?, ?, ?)',
      [name, description || null, price, estimated_duration || null]
    );
    res.status(201).json({ message: 'Service created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/services/:id (admin only)
const updateService = async (req, res) => {
  const { name, description, price, estimated_duration } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE service SET name = ?, description = ?, price = ?, estimated_duration = ? WHERE id = ?',
      [name, description || null, price, estimated_duration || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/services/:id (admin only)
const deleteService = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM service WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService };