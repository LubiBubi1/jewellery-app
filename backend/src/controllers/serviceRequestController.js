const db = require('../db');

// POST /api/service-requests — submit a request
const createServiceRequest = async (req, res) => {
  const { description, service_id } = req.body;
  const user_id = req.user.id;

  if (!service_id) return res.status(400).json({ message: 'Service is required' });

  try {
    const [result] = await db.query(
      'INSERT INTO service_request (description, status, user_id, service_id) VALUES (?, ?, ?, ?)',
      [description || null, 'pending', user_id, service_id]
    );
    res.status(201).json({ message: 'Service request submitted', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/service-requests/my — get logged in user's requests
const getMyServiceRequests = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT sr.*, s.name AS service_name, s.price FROM service_request sr LEFT JOIN service s ON sr.service_id = s.id WHERE sr.user_id = ? ORDER BY sr.request_date DESC',
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/service-requests — get all requests (admin)
const getAllServiceRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT sr.*, s.name AS service_name, u.first_name, u.last_name, u.email FROM service_request sr LEFT JOIN service s ON sr.service_id = s.id LEFT JOIN user u ON sr.user_id = u.id ORDER BY sr.request_date DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/service-requests/:id/status — update status (admin)
const updateServiceRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE service_request SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createServiceRequest, getMyServiceRequests, getAllServiceRequests, updateServiceRequestStatus };