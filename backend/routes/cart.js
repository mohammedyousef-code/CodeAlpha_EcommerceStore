const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Get cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Add to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const [existing] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      await db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }
    res.json({ message: 'Added to cart.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Update quantity
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ message: 'Quantity must be at least 1.' });

    await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );
    res.json({ message: 'Cart updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Remove item
router.delete('/remove/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;