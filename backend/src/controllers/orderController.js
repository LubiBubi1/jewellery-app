const db = require('../db');

// POST /api/orders — create order from cart
const createOrder = async (req, res) => {
  const { items, delivery_address, payment_method } = req.body;
  const user_id = req.user.id;

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No items in order' });
  if (!delivery_address || !payment_method)
    return res.status(400).json({ message: 'Delivery address and payment method are required' });

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const total_price = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    const [orderResult] = await connection.query(
      'INSERT INTO `order` (total_price, delivery_address, payment_method, user_id) VALUES (?, ?, ?, ?)',
      [total_price.toFixed(2), delivery_address, payment_method, user_id]
    );

    const order_id = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_item (quantity, unit_price, order_id, product_id) VALUES (?, ?, ?, ?)',
        [item.quantity, item.price, order_id, item.id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully', order_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
};

// GET /api/orders/my — get logged in user's orders
const getMyOrders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [orders] = await db.query(
      'SELECT * FROM `order` WHERE user_id = ? ORDER BY order_date DESC',
      [user_id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        'SELECT oi.*, p.name FROM order_item oi LEFT JOIN product p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/orders — get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT o.*, u.first_name, u.last_name, u.email FROM `order` o LEFT JOIN user u ON o.user_id = u.id ORDER BY o.order_date DESC'
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/orders/:id/status — update order status (admin only)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE `order` SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };