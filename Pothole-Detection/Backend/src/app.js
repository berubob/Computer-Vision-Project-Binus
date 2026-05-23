const express = require('express');
const path = require('path');
const detectRoutes = require('./routes/detectRoutes');

const app = express();

// Middleware
app.use(express.json());

// Static file serving
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/detect', detectRoutes);

module.exports = app;