const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
require('dotenv').config(); // Ensure dotenv is configured here
const app = express();

// Connect Database
connectDB()
  .then(() => console.log('Database connected!'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect to the database
  });

// Init Middleware
app.use(express.json({ extended: false }));

const corsOptions = {
  origin: [
    'https://task-management-rust-psi.vercel.app/'
  ],
  credentials: true,
};

app.use(cors(corsOptions));



// Define Routes
app.use('/api/auth', require('./routes/auth'));

// filepath: ./server.js
app.use('/api/tasks', require('./routes/tasks'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


app.get('/', (req, res) => {
  res.send({
    message: '✅ Task Management Backend is working properly!',
    status: 'success',
    environment: process.env.NODE_ENV || 'development',
    date: new Date(),
  });
});
