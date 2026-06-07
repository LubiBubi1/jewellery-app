const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/db');
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const serviceRequestRoutes = require('./src/routes/serviceRequestRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Jewellery App API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected!', result: rows[0].result });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});