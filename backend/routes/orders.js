const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Place order
router.post('/place', verifyToken, async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.quantity, p.id as product_id, p.price, p.stock, p.name
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0)
      return res.status(400).json({ message: 'Cart is empty.' });

    for (const item of cartItems) {
      if (item.quantity > item.stock)
        return res.status(400).json({ message: `Not enough stock for ${item.name}.` });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [order] = await db.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [req.user.id, total.toFixed(2)]
    );

    const orderId = order.insertId;

    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({ message: 'Order placed successfully.', order_id: orderId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get order history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.quantity, oi.price, p.name, p.image_url
         FROM order_items oi JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;