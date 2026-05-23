const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Pastikan folder outputs ada
const outputDir = path.join(__dirname, '../outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ─── Mock AI Model ────────────────────────────────────────────────────────────
// TODO: Ganti fungsi ini dengan integrasi model AI nyata (Python/YOLO/dll)
function runMockAIModel(filePath, type) {
  const tipeOptions = ['retak', 'lubang', 'permukaan_baik'];
  const kondisiOptions = ['baik', 'sedang', 'rusak_ringan', 'rusak_berat'];

  return {
    tipe: tipeOptions[Math.floor(Math.random() * tipeOptions.length)],
    kondisi_jalan: kondisiOptions[Math.floor(Math.random() * kondisiOptions.length)],
  };
}

// ─── detectImage ─────────────────────────────────────────────────────────────
const detectImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const id = uuidv4();
  const filePath = req.file.path;

  // TODO: Panggil model AI nyata di sini
  const result = runMockAIModel(filePath, 'image');

  // Simulasi output file (copy input ke outputs sebagai contoh)
  const outputFileName = `result-${id}${path.extname(req.file.originalname)}`;
  const outputPath = path.join(outputDir, outputFileName);
  fs.copyFileSync(filePath, outputPath);

  return res.status(200).json({
    id,
    status: 'success',
    tipe: result.tipe,
    kondisi_jalan: result.kondisi_jalan,
    output_file: `/outputs/${outputFileName}`,
  });
};

// ─── detectVideo ─────────────────────────────────────────────────────────────
const detectVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const id = uuidv4();
  const filePath = req.file.path;

  // TODO: Panggil model AI nyata di sini
  const result = runMockAIModel(filePath, 'video');

  const outputFileName = `result-${id}${path.extname(req.file.originalname)}`;
  const outputPath = path.join(outputDir, outputFileName);
  fs.copyFileSync(filePath, outputPath);

  return res.status(200).json({
    id,
    status: 'success',
    tipe: result.tipe,
    kondisi_jalan: result.kondisi_jalan,
    output_file: `/outputs/${outputFileName}`,
  });
};

module.exports = { detectImage, detectVideo };