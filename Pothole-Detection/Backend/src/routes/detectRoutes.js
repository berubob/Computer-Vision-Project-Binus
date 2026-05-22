const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { detectImage, detectVideo } = require('../controllers/detectController');

// Upload & deteksi gambar
router.post('/image', upload.single('file'), detectImage);

// Upload & deteksi video
router.post('/video', upload.single('file'), detectVideo);

module.exports = router;