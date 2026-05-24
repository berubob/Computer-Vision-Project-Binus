const BASE_URL = '/api/detect';

export interface DetectResult {
  id: string;
  status: string;
  tipe: string;
  kondisi_jalan: string;
  confidence: number;        // ← tambah
  total_deteksi: number;     // ← tambah
  best_box: {                // ← tambah
    x: number;
    y: number;
    w: number;
    h: number;
    confidence: number;
  } | null;
  output_file: string;
}

export async function detectImage(file: File): Promise<DetectResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function detectVideo(file: File): Promise<DetectResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/video`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}