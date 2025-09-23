

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors

const app = express();

const PORT = 3002; //new port

app.use(cors()); 
app.use(express.json()); 


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123', 
  database: 'measurement_db' 
});

db.connect((err) => {
  if (err) {
    return console.error('Error connecting to measurement_db:', err);
  }
  console.log('Successfully connected to measurement_db.');
});

// API ENDPOINTS

// GET endpoint to fetch all saved measurements (for Postman demo)
app.get('/api/measurements', (req, res) => {
  const query = 'SELECT * FROM measurements ORDER BY created_at DESC;';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching measurements.');
    }
    res.json(results);
  });
});

// POST endpoint to save new measurements
app.post('/api/measurements', (req, res) => {
  const { userName, measurements } = req.body;
  const { shoulderWidth, hipWidth, torsoHeight } = measurements;

  const query = `
    INSERT INTO measurements (user_name, shoulder_width, hip_width, torso_height)
    VALUES (?, ?, ?, ?);
  `;

  db.query(query, [userName, shoulderWidth, hipWidth, torsoHeight], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving measurements.');
    }
    res.status(201).send({ message: 'Measurements saved successfully!', id: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log(`Measurement server is running on http://localhost:${PORT}`);
});