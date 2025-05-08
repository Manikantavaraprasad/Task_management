const express = require('express');
const { connectDB } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB()
  .then(() => console.log('Database connected!'))
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  });

// Init Middleware
app.use(express.json());

app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
