const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 8 } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (sort === 'price_asc') query += ' ORDER BY price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY price DESC';
    else query += ' ORDER BY created_at DESC';

    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(query, params);

    const [countRows] = await db.query('SELECT COUNT(*) as total FROM products WHERE 1=1');
    const total = countRows[0].total;

    res.json({ products: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Product not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT category FROM products');
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;