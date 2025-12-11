const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// all active listings
app.get('/api/listings', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC',
      ['active']
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// create new listing
app.post('/api/listings', async (req, res) => {
  const { title, description, price, seller_name, seller_email } = req.body;
  
  if (!title || !price || !seller_name || !seller_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO listings (title, description, price, seller_name, seller_email) VALUES (?, ?, ?, ?, ?)',
      [title, description, price, seller_name, seller_email]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Listing created successfully' 
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// delete listing
app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM listings WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// buy listing (mark as sold)
app.post('/api/listings/:id/buy', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'UPDATE listings SET status = ? WHERE id = ? AND status = ?',
      ['sold', id, 'active']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Listing not found or already sold' });
    }
    
    res.json({ message: 'Purchase successful' });
  } catch (error) {
    console.error('Error buying listing:', error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});