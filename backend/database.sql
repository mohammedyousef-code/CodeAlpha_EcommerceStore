CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Laptop Pro 15', 'High performance laptop with 16GB RAM and 512GB SSD', 1299.99, 10, 'Electronics', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
('Wireless Headphones', 'Noise cancelling bluetooth headphones', 199.99, 25, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('Running Shoes', 'Lightweight and comfortable running shoes', 89.99, 50, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('Coffee Maker', 'Programmable 12-cup coffee maker', 49.99, 30, 'Kitchen', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
('Backpack', 'Durable 30L hiking backpack', 69.99, 40, 'Sports', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Smartwatch', 'Fitness tracker with heart rate monitor', 249.99, 15, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 34.99, 60, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'),
('Yoga Mat', 'Non-slip 6mm yoga mat', 29.99, 45, 'Sports', 'https://images.unsplash.com/photo-1601925228210-d55e5973e4b0?w=400');