import React from 'react';

const FeaturesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Precision Mapping (Left Card - Dominant) */}
      <div className="lg:col-span-7 bg-[#111723] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group min-h-[380px]">
        <div className="space-y-3 z-10">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            Real-time Telemetry
          </span>
          <h3 className="text-xl font-bold">Precision Mapping & Localization</h3>
          <p className="text-gray-400 text-xs w-full leading-relaxed text-center">
            Every detected defect is automatically pinned to a global map with sub-meter accuracy using integrated GPS metadata and visual odometry.
          </p>
        </div>

        {/* Simulated Map Graphic Container */}
        <div className="absolute bottom-0 left-0 w-full h-48 border-t border-gray-800/60 bg-[#0e131f] overflow-hidden">
          {/* Kamu bisa ganti ini dengan real map component (e.g. Leaflet/Mapbox) */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#22314d_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Mock Glowing Polyline Paths */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/1999/svg">
            <path d="M -20 120 Q 120 40 280 110 T 600 70" fill="none" stroke="#00f2fe" strokeWidth="2" className="shadow-[0_0_10px_#00f2fe]" />
            <path d="M 150 160 L 320 20 L 550 140" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />
            
            {/* Blinking Data Nodes */}
            <circle cx="280" cy="110" r="5" fill="#fbbf24" className="animate-pulse" />
            <circle cx="120" cy="75" r="4" fill="#00f2fe" />
            <circle cx="460" cy="90" r="5" fill="#fbbf24" />
          </svg>
        </div>
      </div>

      {/* Right Column Grid Area */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Structural Severity Grading Card */}
        <div className="bg-[#111723] border border-gray-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Structural Severity Grading</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              PCI (Pavement Condition Index) automated scoring based on international engineering standards.
            </p>
          </div>
        </div>

        {/* Inner Sub-grid (2 Smaller Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 grow">
          {/* Fleet Integration */}
          <div className="bg-[#111723] border border-gray-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-2">
            <div className="text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h5 className="font-bold text-xs">Fleet Integration</h5>
            <p className="text-gray-500 text-[11px] leading-normal">
              Sync with existing municipal fleet management systems.
            </p>
          </div>

          {/* Quality Audit */}
          <div className="bg-[#111723] border border-gray-800 rounded-2xl p-5 flex flex-col justify-center items-center text-center space-y-2">
            <div className="text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h5 className="font-bold text-xs">Quality Audit</h5>
            <p className="text-gray-500 text-[11px] leading-normal">
              Human-in-the-loop verification for critical urban zones.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturesGrid;