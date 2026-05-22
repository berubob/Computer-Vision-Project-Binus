const { v4: uuidv4 } = require('uuid');

// Nanti fungsi ini diganti dengan pemanggilan model AI sungguhan
const mockAIModel = (filePath, fileType) => {
  return {
    jumlah_pothole: 3,
    tingkat_kerusakan: 'sedang',
    confidence: 0.87,
    area_terdampak: '42%'
  };
};

const detectImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File gambar tidak ditemukan' });
  }

  const id = uuidv4();
  const filePath = req.file.path;

  // TODO: ganti mockAIModel dengan pemanggilan model AI asli
  const hasil = mockAIModel(filePath, 'image');

  res.json({
    id,
    status: 'success',
    tipe: 'image',
    kondisi_jalan: hasil,
    output_file: `/outputs/${id}.jpg` // nanti diisi hasil dari model AI
  });
};

const detectVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File video tidak ditemukan' });
  }

  const id = uuidv4();
  const filePath = req.file.path;

  // TODO: ganti mockAIModel dengan pemanggilan model AI asli
  const hasil = mockAIModel(filePath, 'video');

  res.json({
    id,
    status: 'success',
    tipe: 'video',
    kondisi_jalan: hasil,
    output_file: `/outputs/${id}.mp4` // nanti diisi hasil dari model AI
  });
};

module.exports = { detectImage, detectVideo };