const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123', 
  database: 'anokha_style_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Successfully connected to anokha_style_db.');
});



// GET all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products;';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET all designs for a specific user
app.get('/api/users/:userId/designs', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT d.design_name, d.image_url FROM designs d WHERE d.user_id = ?;';
  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});




// 1. GET a single product by its ID
// This shows how to fetch a specific item from a table.
app.get('/api/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = 'SELECT * FROM products WHERE product_id = ?;';

    db.query(query, [productId], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(results[0]); 
    });
});


// 2. GET all orders for a specific user
// This shows a simple JOIN to get high-level order information.
app.get('/api/users/:userId/orders', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT o.order_id, o.order_date, o.total_amount, o.status 
        FROM orders o 
        WHERE o.user_id = ?;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// 3. GET all items within a single specific order
// This is an advanced query showing multiple JOINs.
app.get('/api/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const query = `
        SELECT p.name, p.category, d.design_name, oi.quantity, oi.price_per_item
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        LEFT JOIN designs d ON oi.design_id = d.design_id
        WHERE oi.order_id = ?;
    `;
    

    db.query(query, [orderId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.listen(PORT, () => {
  console.log(`Anokha Style server is running on http://localhost:${PORT}`);
});