import React from 'react';

const PCIChart: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-end">
      {/* Grafik SVG Responsif */}
      <svg className="w-full h-32 overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
        <defs>
          {/* Efek Gradasi di Bawah Garis Tren */}
          <linearGradient id="pciGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Gradasi */}
        <path d="M 0 10 Q 250 20, 500 50 T 1000 85 L 1000 100 L 0 100 Z" fill="url(#pciGrad)" />

        {/* Garis Tren Utama */}
        <path d="M 0 10 Q 250 20, 500 50 T 1000 85" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

        {/* Titik Point Indikator Saat Ini */}
        <circle cx="1000" cy="85" r="5" fill="#f59e0b" className="animate-ping" />
        <circle cx="1000" cy="85" r="4" fill="#ef4444" />
      </svg>

      {/* Label Sumbu X */}
      <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase mt-3 pt-2 border-t border-gray-800/40">
        <span>Q1 2025 (PCI 98%)</span>
        <span>Q2 2025</span>
        <span>Q3 2025 (PCI 75%)</span>
        <span>Current (PCI 66%)</span>
      </div>
    </div>
  );
};

export default PCIChart;