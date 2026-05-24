import React from 'react';
import type { DetectResult } from './services/detectService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  result: DetectResult;
  onBack: () => void;
}

// ─── Helper: kondisi → warna & label ─────────────────────────────────────────
function getKondisiStyle(kondisi: string) {
  switch (kondisi) {
    case 'rusak_berat':
      return { badge: 'bg-red-500/10 border-red-500/20 text-red-400', dot: 'bg-red-500', label: 'Rusak Berat' };
    case 'rusak_ringan':
      return { badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400', dot: 'bg-orange-500', label: 'Rusak Ringan' };
    case 'sedang':
      return { badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', dot: 'bg-yellow-500', label: 'Sedang' };
    default:
      return { badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'bg-emerald-500', label: 'Baik' };
  }
}

function getTipeLabel(tipe: string) {
  switch (tipe) {
    case 'lubang': return 'Pothole / Lubang';
    case 'retak': return 'Retak Permukaan';
    default: return 'Permukaan Baik';
  }
}

// ─── Helper: confidence → PCI score (0-100) ───────────────────────────────────
function getPCIScore(kondisi: string, confidence: number) {
  const base: Record<string, number> = {
    baik: 85,
    sedang: 65,
    rusak_ringan: 45,
    rusak_berat: 25,
  };
  const score = base[kondisi] ?? 50;
  // Sedikit variasi berdasarkan confidence
  return Math.min(100, Math.max(0, Math.round(score - (confidence * 10))));
}

function getPCILabel(score: number) {
  if (score >= 85) return { label: 'Excellent', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  if (score >= 70) return { label: 'Good', color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400' };
  if (score >= 55) return { label: 'Fair', color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' };
  if (score >= 40) return { label: 'Sub-Optimal', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400' };
  return { label: 'Critical', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' };
}

// ─── Bounding Box Canvas ──────────────────────────────────────────────────────
interface BoxProps {
  imageUrl: string;
  box: DetectResult['best_box'];
  kondisi: string;
}

const BoundingBoxCanvas: React.FC<BoxProps> = ({ imageUrl, box, kondisi }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Sesuaikan canvas dengan ukuran gambar
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Gambar image
      ctx.drawImage(img, 0, 0);

      // Gambar bounding box kalau ada
      if (box) {
        const color = kondisi === 'rusak_berat' ? '#ef4444'
          : kondisi === 'rusak_ringan' ? '#f97316'
          : kondisi === 'sedang' ? '#eab308'
          : '#22c55e';

        // YOLO output: x,y = center, w,h = width/height (dalam pixel 640x640)
        // Scale ke ukuran asli gambar
        const scaleX = img.naturalWidth / 640;
        const scaleY = img.naturalHeight / 640;

        const x = (box.x - box.w / 2) * scaleX;
        const y = (box.y - box.h / 2) * scaleY;
        const w = box.w * scaleX;
        const h = box.h * scaleY;

        // Border box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        // Background label
        const label = `Pothole ${Math.round(box.confidence * 100)}%`;
        ctx.font = 'bold 16px monospace';
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 24, textWidth + 12, 24);

        // Teks label
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x + 6, y - 6);
      }

      setLoaded(true);
    };
  }, [imageUrl, box, kondisi]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#0d111a] border border-gray-800">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const ReportDashboard: React.FC<Props> = ({ result, onBack }) => {
  const kondisiStyle = getKondisiStyle(result.kondisi_jalan);
  const pciScore = getPCIScore(result.kondisi_jalan, result.confidence ?? 0);
  const pciLabel = getPCILabel(pciScore);
  const confidencePct = Math.round((result.confidence ?? 0) * 100);
  const imageUrl = result.output_file ? `http://localhost:3000${result.output_file}` : null;
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#0d111a',
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`report-${result.id.slice(0, 8)}.pdf`);
  };

  return (
    <div ref={reportRef} className="min-h-screen bg-[#0d111a] text-white p-6 font-sans">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            ID: {result.id.slice(0, 8)}... • Live Analysis Report
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Infrastructure Integrity Assessment</h1>

          {/* Tags hasil deteksi */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${kondisiStyle.badge}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${kondisiStyle.dot} mr-1.5`}></span>
              {kondisiStyle.label}
            </span>
            <span className="px-3 py-1 border border-amber-500/20 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold">
              {getTipeLabel(result.tipe)}
            </span>
            <span className="px-3 py-1 border border-gray-700 bg-gray-800/50 text-gray-400 rounded-full text-xs font-semibold">
              Confidence: {confidencePct}%
            </span>
            {result.total_deteksi !== undefined && (
              <span className="px-3 py-1 border border-gray-700 bg-gray-800/50 text-gray-400 rounded-full text-xs font-semibold">
                {result.total_deteksi} Titik Terdeteksi
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-gray-300">
            📁 Export PDF
          </button>
          <button
            onClick={onBack}
            className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-gray-300">
            ← Kembali
          </button>
        </div>
      </div>

      {/* ── Grid Atas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Card PCI Score */}
        <div className="lg:col-span-3 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Pavement Condition Index</h3>
          <div className="flex items-baseline gap-3">
            <span className={`text-7xl font-extrabold tracking-tight ${pciLabel.color}`}>{pciScore}</span>
            <span className={`px-2.5 py-1 border text-xs font-bold rounded-md uppercase ${pciLabel.badge}`}>
              {pciLabel.label}
            </span>
          </div>
          <div className="mt-4 border-t border-gray-800/60 pt-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              Kondisi jalan terdeteksi <strong className="text-white">{kondisiStyle.label}</strong> dengan
              {' '}<span className="text-amber-500 font-semibold">{confidencePct}%</span> tingkat keyakinan model.
            </p>
          </div>
        </div>

        {/* Card Hasil Deteksi */}
        <div className="lg:col-span-3 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hasil Deteksi</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Tipe Kerusakan</span>
              <span className="text-white text-xs font-semibold">{getTipeLabel(result.tipe)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Kondisi Jalan</span>
              <span className={`text-xs font-semibold ${kondisiStyle.badge} px-2 py-0.5 rounded border`}>
                {kondisiStyle.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${confidencePct}%` }} />
                </div>
                <span className="text-amber-400 text-xs font-semibold">{confidencePct}%</span>
              </div>
            </div>
            {result.total_deteksi !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs">Total Deteksi</span>
                <span className="text-white text-xs font-semibold">{result.total_deteksi} titik</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800" />

          {/* Maintenance Priority */}
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Maintenance Priority</p>

            {[
              {
                show: result.kondisi_jalan === 'rusak_berat',
                icon: '🚨',
                priority: 'Critical',
                textColor: 'text-red-400',
                borderColor: 'border-l-red-500',
                desc: 'Immediate reconstruction within 7 days.',
              },
              {
                show: result.kondisi_jalan === 'rusak_ringan',
                icon: '⚠️',
                priority: 'High',
                textColor: 'text-orange-400',
                borderColor: 'border-l-orange-500',
                desc: 'Schedule patching within 30 days.',
              },
              {
                show: result.kondisi_jalan === 'sedang',
                icon: '🔶',
                priority: 'Medium',
                textColor: 'text-yellow-400',
                borderColor: 'border-l-yellow-500',
                desc: 'Preventive maintenance within 90 days.',
              },
              {
                show: result.kondisi_jalan === 'baik',
                icon: '✅',
                priority: 'Low',
                textColor: 'text-emerald-400',
                borderColor: 'border-l-emerald-500',
                desc: 'Routine inspection in 6 months.',
              },
            ]
              .filter(item => item.show)
              .map((item, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg bg-[#0d111a] border-l-2 ${item.borderColor}`}>
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <p className={`text-xs font-bold ${item.textColor}`}>{item.priority}</p>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}

            {(result.confidence ?? 0) < 0.5 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0d111a] border-l-2 border-l-blue-500">
                <span className="text-base">🔍</span>
                <div>
                  <p className="text-xs font-bold text-blue-400">Verify</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">Low confidence. Manual inspection recommended.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Gambar Output */}
        <div className="lg:col-span-6 bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Output Visual</h3>
          {imageUrl ? (
            <BoundingBoxCanvas
              imageUrl={imageUrl}
              box={result.best_box}
              kondisi={result.kondisi_jalan}
            />
          ) : (
            <div className="w-full h-44 rounded-xl bg-[#0d111a] border border-gray-800 flex items-center justify-center">
              <span className="text-gray-600 text-xs">Tidak ada output visual</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid Bawah ── */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Damage Distribution</h3>
          <p className="text-gray-500 text-xs mb-6">
            Berdasarkan hasil deteksi: {result.total_deteksi ?? 0} titik kerusakan
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">{getTipeLabel(result.tipe)}</span>
                <span className="text-gray-400 font-semibold">{confidencePct}%</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${confidencePct}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Kondisi {kondisiStyle.label}</span>
                <span className="text-gray-400 font-semibold">{100 - pciScore}% degradasi</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${kondisiStyle.dot}`} style={{ width: `${100 - pciScore}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">PCI Score</span>
                <span className="text-gray-400 font-semibold">{pciScore}/100</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${pciScore}%` }} />
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;