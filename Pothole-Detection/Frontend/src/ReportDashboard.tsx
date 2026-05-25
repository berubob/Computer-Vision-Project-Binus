import React from 'react';
import type { DetectResult } from './services/detectService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  result: DetectResult;
  onBack: () => void;
}

function getRoadStatusStyle(status: string) {
  switch (status) {
    case 'CRITICAL':
      return { color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400', border: 'border-l-red-500', icon: '🚨' };
    case 'SERIOUS':
      return { color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400', border: 'border-l-orange-500', icon: '⚠️' };
    case 'WARNING':
      return { color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', border: 'border-l-yellow-500', icon: '🔶' };
    default:
      return { color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', border: 'border-l-emerald-500', icon: '✅' };
  }
}

function getMaintenanceDesc(status: string) {
  switch (status) {
    case 'CRITICAL': return 'Diperlukan rekonstruksi segera dalam 7 hari.';
    case 'SERIOUS':  return 'Jadwalkan penambalan dan perbaikan dalam 30 hari.';
    case 'WARNING':  return 'Disarankan pemeliharaan preventif dalam 90 hari.';
    default:         return 'Tidak diperlukan tindakan. Inspeksi rutin dalam 6 bulan.';
  }
}

function getMaintenancePriority(status: string) {
  switch (status) {
    case 'CRITICAL': return 'Prioritas Kritis';
    case 'SERIOUS':  return 'Prioritas Tinggi';
    case 'WARNING':  return 'Prioritas Sedang';
    default:         return 'Prioritas Rendah';
  }
}

function getPCIScore(rhi: number) {
  return rhi;
}

function getPCILabel(score: number) {
  if (score >= 85) return { label: 'Sangat Baik', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  if (score >= 70) return { label: 'Baik', color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400' };
  if (score >= 55) return { label: 'Cukup', color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' };
  if (score >= 40) return { label: 'Kurang Optimal', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400' };
  return { label: 'Kritis', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' };
}

// ─── Bounding Box Canvas ──────────────────────────────────────────────────────
interface BoxProps {
  imageUrl: string;
  box: DetectResult['best_box'];
  road_status: string;
}

const BoundingBoxCanvas: React.FC<BoxProps> = ({ imageUrl, box, road_status }) => {
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
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      if (box) {
        const color = road_status === 'CRITICAL' ? '#ef4444'
          : road_status === 'SERIOUS' ? '#f97316'
          : road_status === 'WARNING' ? '#eab308'
          : '#22c55e';

        const scaleX = img.naturalWidth / 640;
        const scaleY = img.naturalHeight / 640;
        const x = (box.x - box.w / 2) * scaleX;
        const y = (box.y - box.h / 2) * scaleY;
        const w = box.w * scaleX;
        const h = box.h * scaleY;

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        const label = `Lubang ${Math.round(box.confidence * 100)}%`;
        ctx.font = 'bold 16px monospace';
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 24, textWidth + 12, 24);
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x + 6, y - 6);
      }

      setLoaded(true);
    };
  }, [imageUrl, box, road_status]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#0d111a] border border-gray-800">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-auto" style={{ display: loaded ? 'block' : 'none' }} />
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const ReportDashboard: React.FC<Props> = ({ result, onBack }) => {
  const statusStyle = getRoadStatusStyle(result.road_status);
  const pciScore = getPCIScore(result.rhi ?? 0);
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
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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
            ID: {result.id.slice(0, 8)}... • Laporan Analisis Langsung
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Penilaian Integritas Infrastruktur</h1>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${statusStyle.badge}`}>
              {statusStyle.icon} {result.road_status}
            </span>
            <span className="px-3 py-1 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold">
              RHI: {result.rhi}%
            </span>
            <span className="px-3 py-1 border border-amber-500/20 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold">
              MPS: {result.mps}/100
            </span>
            <span className="px-3 py-1 border border-gray-700 bg-gray-800/50 text-gray-400 rounded-full text-xs font-semibold">
              {result.potholes_detected} Lubang Terdeteksi
            </span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleExportPDF} className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-gray-300">
            📁 Ekspor PDF
          </button>
          <button onClick={onBack} className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-gray-300">
            ← Kembali
          </button>
        </div>
      </div>

      {/* ── Grid Atas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Card RHI */}
        <div className="lg:col-span-3 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Indeks Kesehatan Jalan</h3>
          <div className="flex items-baseline gap-3">
            <span className={`text-7xl font-extrabold tracking-tight ${pciLabel.color}`}>{pciScore}</span>
            <span className={`px-2.5 py-1 border text-xs font-bold rounded-md uppercase ${pciLabel.badge}`}>
              {pciLabel.label}
            </span>
          </div>
          <div className="mt-4 border-t border-gray-800/60 pt-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              Kesehatan jalan berada pada <span className="text-amber-500 font-semibold">{result.rhi}%</span> dengan skor lubang maksimal sebesar <span className="text-amber-500 font-semibold">{result.mps}/100</span>.
            </p>
          </div>
        </div>

        {/* Card Detection Result + Maintenance Priority */}
        <div className="lg:col-span-3 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Hasil Deteksi</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Lubang Terdeteksi</span>
              <span className="text-white text-xs font-semibold">{result.potholes_detected ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Indeks Kesehatan Jalan</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.rhi}%` }} />
                </div>
                <span className="text-emerald-400 text-xs font-semibold">{result.rhi}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Skor Lubang Maksimal</span>
              <span className="text-amber-400 text-xs font-semibold">{result.mps}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Tingkat Kepercayaan</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${confidencePct}%` }} />
                </div>
                <span className="text-amber-400 text-xs font-semibold">{confidencePct}%</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800" />

          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Prioritas Perawatan</p>
            <div className={`flex items-start gap-3 p-3 rounded-lg bg-[#0d111a] border-l-2 ${statusStyle.border}`}>
              <span className="text-base">{statusStyle.icon}</span>
              <div>
                <p className={`text-xs font-bold ${statusStyle.color}`}>
                  {result.road_status} — {getMaintenancePriority(result.road_status)}
                </p>
                <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                  {getMaintenanceDesc(result.road_status)}
                </p>
              </div>
            </div>

            {confidencePct < 50 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0d111a] border-l-2 border-l-blue-500">
                <span className="text-base">🔍</span>
                <div>
                  <p className="text-xs font-bold text-blue-400">Verifikasi</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">Kepercayaan rendah. Inspeksi manual direkomendasikan.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Output Visual */}
        <div className="lg:col-span-6 bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Visual Hasil</h3>
          {imageUrl ? (
            <BoundingBoxCanvas imageUrl={imageUrl} box={result.best_box} road_status={result.road_status} />
          ) : (
            <div className="w-full h-44 rounded-xl bg-[#0d111a] border border-gray-800 flex items-center justify-center">
              <span className="text-gray-600 text-xs">Tidak ada hasil visual</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Grid Bawah ── */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Distribusi Kerusakan</h3>
          <p className="text-gray-500 text-xs mb-6">
            Berdasarkan hasil deteksi: {result.potholes_detected ?? 0} lubang ditemukan
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Road Health Index (RHI)</span>
                <span className="text-gray-400 font-semibold">{result.rhi}%</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${result.rhi}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Skor Lubang Maksimal (MPS)</span>
                <span className="text-gray-400 font-semibold">{result.mps}/100</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${result.mps}%` }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-300">Confidence</span>
                <span className="text-gray-400 font-semibold">{confidencePct}%</span>
              </div>
              <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${confidencePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReportDashboard;