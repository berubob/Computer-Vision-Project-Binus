const express = require('express');
const path = require('path');
const detectRoutes = require('./routes/detectRoutes');

const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Static file serving
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/detect', detectRoutes);

module.exports = app;