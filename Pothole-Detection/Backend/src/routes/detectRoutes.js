const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { detectImage, detectVideo } = require('../controllers/detectController');

router.post('/image', upload.single('file'), detectImage);
router.post('/video', upload.single('file'), detectVideo);


module.exports = router;