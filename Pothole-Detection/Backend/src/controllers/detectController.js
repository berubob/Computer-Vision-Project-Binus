const ort = require('onnxruntime-node');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const outputDir = path.join(__dirname, '../outputs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const MODEL_PATH = path.join(__dirname, '../../models/pothole_model.onnx');
let sessionPromise = ort.InferenceSession.create(MODEL_PATH);

// ─── Preprocessing ────────────────────────────────────────────────────────────
async function preprocessImage(filePath) {
  const { data } = await sharp(filePath)
    .resize(640, 640)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert HWC → CHW (YOLO butuh format channel-first)
  const float32 = new Float32Array(3 * 640 * 640);
  for (let i = 0; i < 640 * 640; i++) {
    float32[0 * 640 * 640 + i] = data[i * 3 + 0] / 255.0; // R
    float32[1 * 640 * 640 + i] = data[i * 3 + 1] / 255.0; // G
    float32[2 * 640 * 640 + i] = data[i * 3 + 2] / 255.0; // B
  }

  return new ort.Tensor('float32', float32, [1, 3, 640, 640]);
}

// ─── Interpretasi Output [1, 5, 8400] ────────────────────────────────────────
function interpretOutput(outputData, confThreshold = 0.25) {
  // outputData flat array panjang 42000
  // Struktur: [x(8400), y(8400), w(8400), h(8400), conf(8400)]
  const numBoxes = 8400;

  let bestConf = 0;
  let bestBox = null;
  let detectedBoxes = 0;

  for (let i = 0; i < numBoxes; i++) {
    const conf = outputData[4 * numBoxes + i]; // confidence ada di row ke-4

    if (conf > confThreshold) {
      detectedBoxes++;
      if (conf > bestConf) {
        bestConf = conf;
        bestBox = {
          x: outputData[0 * numBoxes + i],
          y: outputData[1 * numBoxes + i],
          w: outputData[2 * numBoxes + i],
          h: outputData[3 * numBoxes + i],
          confidence: conf,
        };
      }
    }
  }

  // Tentukan kondisi jalan berdasarkan jumlah & confidence deteksi
  let tipe, kondisi_jalan;

  if (!bestBox) {
    // Tidak ada pothole terdeteksi
    tipe = 'permukaan_baik';
    kondisi_jalan = 'baik';
  } else if (detectedBoxes >= 5 || bestConf > 0.8) {
    tipe = 'lubang';
    kondisi_jalan = 'rusak_berat';
  } else if (detectedBoxes >= 3 || bestConf > 0.6) {
    tipe = 'lubang';
    kondisi_jalan = 'rusak_ringan';
  } else {
    tipe = 'lubang';
    kondisi_jalan = 'sedang';
  }

  return {
    tipe,
    kondisi_jalan,
    confidence: bestConf,
    total_deteksi: detectedBoxes,
    best_box: bestBox,
  };
}

// ─── detectImage ──────────────────────────────────────────────────────────────
const detectImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const id = uuidv4();
    const session = await sessionPromise;

    const tensor = await preprocessImage(req.file.path);
    const results = await session.run({ images: tensor });
    const outputData = Array.from(results.output0.data);
    const { tipe, kondisi_jalan, confidence, total_deteksi, best_box } = interpretOutput(outputData);

    const outputFileName = `result-${id}.jpg`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.copyFileSync(req.file.path, outputPath);

    return res.status(200).json({
      id,
      status: 'success',
      tipe,
      kondisi_jalan,
      confidence: Math.round(confidence * 100) / 100,
      total_deteksi,
      best_box,
      output_file: `/outputs/${outputFileName}`,
    });

  } catch (err) {
    console.error('Detection error:', err);
    return res.status(500).json({ error: 'Model inference failed', detail: err.message });
  }
};

// ─── detectVideo ──────────────────────────────────────────────────────────────
const detectVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // TODO: Untuk video, perlu extract frame dulu pakai ffmpeg
  // Sementara return info bahwa video diterima
  return res.status(200).json({
    id: uuidv4(),
    status: 'pending',
    message: 'Video received. Frame extraction coming soon.',
    output_file: null,
  });
};

module.exports = { detectImage, detectVideo };