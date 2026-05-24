import React from 'react';

const FeaturesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Card Utama — Cara Kerja AI */}
      <div className="lg:col-span-7 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group min-h-[380px]">
        <div className="space-y-3 z-10">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            Computer Vision
          </span>
          <h3 className="text-xl font-bold">AI-Powered Pothole Detection</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Model YOLOv8 kami dilatih khusus untuk mendeteksi kerusakan jalan dari gambar atau video dengan akurasi tinggi dan waktu inferensi yang cepat.
          </p>
        </div>

        {/* Visual Pipeline */}
        <div className="absolute bottom-0 left-0 w-full h-48 border-t border-gray-800/60 bg-[#0e131f] overflow-hidden flex items-center justify-center px-8">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22314d_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-center justify-between w-full max-w-md">
            {[
              { icon: '🖼️', label: 'Input Gambar' },
              { icon: '⚙️', label: 'YOLOv8 Model' },
              { icon: '📦', label: 'Bounding Box' },
              { icon: '📊', label: 'Laporan' },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#1a2333] border border-gray-700 flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold text-center">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 via-amber-500/50 to-gray-700 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="lg:col-span-5 flex flex-col gap-6">

        {/* Format yang Didukung */}
        <div className="bg-[#111723] border border-gray-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Format yang Didukung</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Upload gambar <span className="text-amber-400 font-semibold">JPG / PNG</span> atau video <span className="text-amber-400 font-semibold">MP4 / AVI</span> hingga 100MB untuk dianalisis.
            </p>
          </div>
        </div>

        {/* 2 Card Kecil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 grow">

          {/* Output Hasil */}
          <div className="bg-[#111723] border border-gray-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-2">
            <div className="text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h5 className="font-bold text-xs">Laporan Otomatis</h5>
            <p className="text-gray-500 text-[11px] leading-normal">
              Hasil deteksi langsung ditampilkan dalam dashboard lengkap dengan skor PCI.
            </p>
          </div>

          {/* Bounding Box */}
          <div className="bg-[#111723] border border-gray-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-2">
            <div className="text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h5 className="font-bold text-xs">Visualisasi Bounding Box</h5>
            <p className="text-gray-500 text-[11px] leading-normal">
              Setiap kerusakan ditandai langsung pada gambar dengan kotak deteksi.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;