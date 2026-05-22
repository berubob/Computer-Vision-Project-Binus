const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve folder outputs agar frontend bisa akses file hasil
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const detectRoutes = require('./routes/detectRoutes');
app.use('/api/detect', detectRoutes);

module.exports = app;