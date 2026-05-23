import React from 'react';
import PCIChart from './components/PCIChart';
import DefectTable from './components/DefectTable';

// Interface untuk tipe data agar TypeScript-mu aman
interface DefectSummary {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

const ReportDashboard: React.FC = () => {
  const defectData: DefectSummary[] = [
    { type: 'Longitudinal Cracks', count: 7, percentage: 50, color: 'bg-amber-500' },
    { type: 'Severe Potholes', count: 4, percentage: 28, color: 'bg-red-500' },
    { type: 'Alligator Cracking', count: 2, percentage: 15, color: 'bg-orange-500' },
    { type: 'Rutting/Deformation', count: 1, percentage: 7, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-[#0d111a] text-white p-6 font-sans">
      {/* Header Laporan */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-bold tracking-widest uppercase mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Sector 7G-14 • Live Analysis Report
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Infrastructure Integrity Assessment</h1>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 text-gray-300">
            📁 Export PDF
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 shadow-lg shadow-amber-500/10">
            🔄 Recalibrate AI
          </button>
        </div>
      </div>

      {/* Grid Atas: Ringkasan & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Card 1: Skor PCI (Highlight Utama) */}
        <div className="lg:col-span-4 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Pavement Condition Index (PCI)</h3>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-extrabold text-amber-500 tracking-tight">66%</span>
              <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-md uppercase">
                Sub-Optimal
              </span>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-800/60 pt-4">
            <p className="text-gray-400 text-xs leading-relaxed">
              Skor <strong className="text-white">66</strong> mengindikasikan bahwa degradasi struktural jalan telah melewati batas aman. Disarankan melakukan rekonstruksi permukaan dalam <span className="text-amber-500 font-semibold">14 hari</span> ke depan.
            </p>
          </div>
        </div>

        {/* Card 2: Grafik Degradasi Tren */}
        <div className="lg:col-span-8 bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Pavement Degradation Trend (12 Months)</h3>
          <div className="h-44 w-full">
            <PCIChart />
          </div>
        </div>
      </div>

      {/* Grid Bawah: Bar Chart Distribusi Kerusakan & Tabel Detil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kiri: Distribusi Tipe Kerusakan */}
        <div className="lg:col-span-5 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Damage Categorization Distribution</h3>
            <p className="text-gray-500 text-xs mb-6">Total terdeteksi: 14 Titik Kerusakan</p>
            
            {/* Custom Tailwind Bar Chart */}
            <div className="space-y-4">
              {defectData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-300">{item.type}</span>
                    <span className="text-gray-400 font-semibold">{item.count} Unit ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-[#1a2233] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-amber-500/80 bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl mt-6">
            💡 <strong>Analisis AI:</strong> Retak longitudinal mendominasi sebesar 50%. Ini mengindikasikan adanya kelelahan struktural (fatigue) pada lapisan base pondasi jalan.
          </p>
        </div>

        {/* Kanan: Tabel Rincian Data */}
        <div className="lg:col-span-7 bg-[#111723] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Quantified Structural Metrics</h3>
          <DefectTable />
        </div>

      </div>
    </div>
  );
};

export default ReportDashboard;