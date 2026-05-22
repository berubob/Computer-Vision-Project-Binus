const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

// Filter hanya gambar dan video
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;