import React, { useState } from 'react';

const HeroSection: React.FC = () => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
      {/* Left Info Text */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold rounded-full uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
          AI-Powered Monitoring
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Precision Defect <br />
          <span className="text-amber-500">Detection</span> Engine
        </h1>
        
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Deploy advanced computer vision to identify, categorize, and prioritize road maintenance. 
          From potholes to longitudinal cracks, automate your infrastructure inspection with millimeter accuracy.
        </p>

        {/* Mini Stats */}
        <div className="flex gap-4 pt-2">
          <div className="bg-[#121824] border border-gray-800 p-4 rounded-xl w-28 text-center">
            <div className="text-2xl font-bold text-amber-500">99.4%</div>
            <div className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Accuracy</div>
          </div>
          <div className="bg-[#121824] border border-gray-800 p-4 rounded-xl w-28 text-center">
            <div className="text-xl font-bold text-amber-500 leading-7">Real-time</div>
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Analysis</div>
          </div>
        </div>
      </div>

      {/* Right Upload Box */}
      <div className="lg:col-span-7">
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          className={`bg-[#111723]/90 border-2 border-dashed ${isDragActive ? 'border-amber-500 bg-[#161f30]' : 'border-gray-800'} rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[340px]`}
        >
          {/* Cloud Icon */}
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>

          <h3 className="text-lg font-bold">Upload Visual Data</h3>
          <p className="text-gray-400 text-xs max-w-sm mt-2 leading-relaxed">
            Drag and drop your dashcam footage, drone images, or mobile inspection clips here.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md justify-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-4a2 2 0 012-2h11a2 2 0 012 2v4" /></svg>
              Browse Files
            </button>
            <button className="bg-[#1a2333] hover:bg-[#222e44] border border-gray-700 text-white text-sm font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              S3 / RTSP Stream
            </button>
          </div>

          {/* Supported Formats */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">📁 MP4, MOV, MKV</span>
            <span className="flex items-center gap-1">🖼️ JPG, PNG, RAW</span>
            <span className="flex items-center gap-1">⚖️ Up to 2GB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;