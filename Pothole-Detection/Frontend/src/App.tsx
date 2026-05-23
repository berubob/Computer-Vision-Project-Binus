import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorkflowSection from './components/WorkflowSection';
import FeaturesGrid from './components/FeaturesGrid';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d111a] text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Background texture subtle effect */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#161f30] to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Navbar />
        <main className="space-y-20 mt-8">
          <HeroSection />
          <WorkflowSection />
          <FeaturesGrid />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#090d14] py-6 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            <span className="font-semibold text-gray-400">Asphalt Intelligence Infrastructure</span>
            <p className="mt-1">© 2026 Asphalt Intelligence Infrastructure. All rights reserved. System Status: Nominal.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition">Terms of Service</a>
            <a href="#" className="hover:text-amber-500 transition">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;