import React, { useState, useRef } from 'react';
import { detectImage, detectVideo } from '../services/detectService';
import type { DetectResult } from '../services/detectService';

interface Props {
  onResult: (result: DetectResult) => void;
}

const HeroSection: React.FC<Props> = ({ onResult }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'video/avi'];
    if (!allowed.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, MP4, atau AVI.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const isVideo = selectedFile.type.startsWith('video/');
      const result = isVideo
        ? await detectVideo(selectedFile)
        : await detectImage(selectedFile);

      onResult(result); // kirim ke App.tsx → pindah ke ReportDashboard
    } catch (err) {
      setError('Gagal menghubungi server. Pastikan backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
      {/* Left Info Text — tidak berubah */}
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
        </p>
        <div className="flex gap-4 pt-2 justify-center">
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
          onDrop={handleDrop}
          className={`bg-[#111723]/90 border-2 border-dashed ${
            isDragActive ? 'border-amber-500 bg-[#161f30]' : 'border-gray-800'
          } rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[340px]`}
        >
          {/* Icon */}
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          {/* File terpilih */}
          {selectedFile ? (
            <div className="mb-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-400 text-sm font-semibold">📎 {selectedFile.name}</p>
              <p className="text-gray-500 text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold">Upload Visual Data</h3>
              <p className="text-gray-400 text-xs max-w-sm mt-2 leading-relaxed">
                Drag and drop file atau klik Browse Files.
              </p>
            </>
          )}

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-xs mt-2 mb-2 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          {/* Input file hidden */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.mp4,.avi"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              📁 Browse Files
            </button>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Analyzing...
                  </>
                ) : '🔍 Analyze Now'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-[11px] text-gray-500">
            <span>📁 MP4, AVI</span>
            <span>🖼️ JPG, PNG</span>
            <span>⚖️ Max 100MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;