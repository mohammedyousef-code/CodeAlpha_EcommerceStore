# CodeAlpha_EcommerceStore

A full-stack e-commerce web application built for the **CodeAlpha Full Stack Development Internship — Task 1**.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

---

## Features

- Product listing with pagination
- Search, filter by category, and sort by price
- Product detail page
- Shopping cart (add, update quantity, remove)
- User registration and login (JWT-based)
- Order placement with stock management
- Order history per user
- Responsive design (mobile and desktop)

---

## Project Structure

```
CodeAlpha_EcommerceStore/
├── backend/
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Profile
│   │   ├── products.js         # Product listing, detail, categories
│   │   ├── cart.js             # Cart CRUD
│   │   └── orders.js           # Place order, order history
│   ├── .env.example            # Environment variables template
│   ├── database.sql            # MySQL schema + seed data
│   ├── package.json
│   └── server.js               # Express app entry point
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js              # Fetch wrapper
    │   ├── auth.js             # Login, register, logout
    │   ├── products.js         # Product display and detail
    │   ├── cart.js             # Cart operations
    │   ├── orders.js           # Order placement and history
    │   └── app.js              # Page routing
    └── index.html              # Single page application
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (v8 or higher)

### 1. Clone the repository

```bash
git clone https://github.com/mohammedyousef-code/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore
```

### 2. Create the database

```bash
mysql -u root -p < backend/database.sql
```

### 3. Configure environment variables

```bash
cd backend
copy .env.example .env
```

Open `.env` and fill in your values:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run the server

```bash
npm run dev
```

### 6. Open the app

Go to [http://localhost:5000](http://localhost:5000) in your browser.

---

### Test Credentials

Email: demo@test.com  
Password: 123456

## API Endpoints

### Auth

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| POST   | /api/auth/register   | Register new user  | No            |
| POST   | /api/auth/login      | Login user         | No            |
| GET    | /api/auth/profile    | Get user profile   | Yes           |

### Products

| Method | Endpoint                    | Description              | Auth Required |
|--------|-----------------------------|--------------------------|---------------|
| GET    | /api/products               | List products (+ filters)| No            |
| GET    | /api/products/:id           | Get product detail       | No            |
| GET    | /api/products/meta/categories | Get all categories    | No            |



### Cart

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| GET    | /api/cart            | Get user cart      | Yes           |
| POST   | /api/cart/add        | Add item to cart   | Yes           |
| PUT    | /api/cart/update/:id | Update quantity    | Yes           |
| DELETE | /api/cart/remove/:id | Remove item        | Yes           |
| DELETE | /api/cart/clear      | Clear entire cart  | Yes           |

### Orders

| Method | Endpoint             | Description        | Auth Required |
|--------|----------------------|--------------------|---------------|
| POST   | /api/orders/place    | Place order        | Yes           |
| GET    | /api/orders/history  | Get order history  | Yes           |

---

## How to Push to GitHub

```bash
# Inside the project folder
git init
git add .
git commit -m "Task 1: E-commerce Store - CodeAlpha Internship"
git branch -M main
git remote add origin https://github.com/mohammedyousef-code/CodeAlpha_EcommerceStore.git
git push -u origin main
```

---

## Internship Info

- **Company:** [CodeAlpha](https://www.codealpha.tech)
- **Task:** Task 1 — Simple E-commerce Store
- **Domain:** Full Stack Development
- **Contact:** services@codealpha.tech
