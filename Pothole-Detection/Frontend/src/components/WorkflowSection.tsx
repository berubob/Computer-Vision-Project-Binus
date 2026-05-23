import React from 'react';

interface StepProps {
  num: number;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const WorkflowStep: React.FC<StepProps> = ({ num, title, desc, icon }) => (
  <div className="flex flex-col items-center text-center max-w-xs px-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
      num === 2 ? 'bg-amber-500 text-black border-amber-600 shadow-lg shadow-amber-500/20' : 'bg-[#121824] text-amber-500 border-gray-800'
    } mb-4`}>
      {icon}
    </div>
    <h4 className="text-base font-bold text-white">{num}. {title}</h4>
    <p className="text-gray-400 text-xs mt-2 leading-relaxed">{desc}</p>
  </div>
);

const WorkflowSection: React.FC = () => {
  return (
    <div className="text-center space-y-12">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold">Inspection Workflow</h2>
        <p className="text-gray-400 text-xs sm:text-sm w-full leading-relaxed text-center">
          Our proprietary detection engine uses multi-stage neural networks to process infrastructure visuals in seconds.
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4 max-w-4xl mx-auto">
        {/* Step 1 */}
        <WorkflowStep 
          num={1}
          title="Upload"
          desc="Ingest raw imagery from any hardware. No proprietary sensors required—dashcams or smartphones are enough."
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />

        {/* Step 2 */}
        <WorkflowStep 
          num={2}
          title="Analyze"
          desc="AI engines scan every frame to detect potholes, rutting, and cracks, tagging them with GPS coordinates."
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0" /></svg>}
        />

        {/* Step 3 */}
        <WorkflowStep 
          num={3}
          title="Get Results"
          desc="Receive a comprehensive damage report with severity ratings, cost estimates, and maintenance work-orders."
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
      </div>
    </div>
  );
};

export default WorkflowSection;