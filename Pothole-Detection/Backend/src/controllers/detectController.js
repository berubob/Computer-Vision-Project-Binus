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
  const numBoxes = 8400;

  let bestConf = 0;
  let bestBox = null;
  let detectedBoxes = 0;
  let totalConfidence = 0;

  for (let i = 0; i < numBoxes; i++) {
    const conf = outputData[4 * numBoxes + i];
    if (conf > confThreshold) {
      detectedBoxes++;
      totalConfidence += conf;
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

  // MPS: Max Pothole Score (confidence tertinggi × 100)
  const mps = Math.round(bestConf * 100);

  // RHI: Road Health Index — semakin banyak & yakin pothole, semakin rendah
  // Formula: 100 - (jumlah box × bobot confidence rata-rata × 10), min 0
  const avgConf = detectedBoxes > 0 ? totalConfidence / detectedBoxes : 0;
  const rhi = Math.max(0, Math.round(100 - (detectedBoxes * avgConf * 10)));

  // Status berdasarkan RHI
  let status, kondisi_jalan;
  if (detectedBoxes === 0) {
    status = 'GOOD';
    kondisi_jalan = 'baik';
  } else if (rhi >= 70) {
    status = 'WARNING';
    kondisi_jalan = 'sedang';
  } else if (rhi >= 40) {
    status = 'SERIOUS';
    kondisi_jalan = 'rusak_ringan';
  } else {
    status = 'CRITICAL';
    kondisi_jalan = 'rusak_berat';
  }

  return {
    tipe: detectedBoxes > 0 ? 'lubang' : 'permukaan_baik',
    kondisi_jalan,
    status,
    rhi,
    mps,
    potholes_detected: detectedBoxes,
    confidence: bestConf,
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
    const { tipe, kondisi_jalan, status, rhi, mps, potholes_detected, confidence, best_box } = interpretOutput(outputData);

    const outputFileName = `result-${id}.jpg`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.copyFileSync(req.file.path, outputPath);

    return res.status(200).json({
      id,
      status: 'success',
      tipe,
      kondisi_jalan,
      road_status: status,   // GOOD / WARNING / SERIOUS / CRITICAL
      rhi,                   // Road Health Index 0-100
      mps,                   // Max Pothole Score 0-100
      potholes_detected,     // jumlah pothole
      confidence,
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