import React from 'react';

interface MetricRow {
  name: string;
  value: string;
  impact: string;
  status: 'FAIL' | 'WARNING' | 'CRITICAL';
}

const DefectTable: React.FC = () => {
  const tableData: MetricRow[] = [
    { name: 'Defect Depth (Avg)', value: '5.2 cm', impact: 'Significant Volume Loss', status: 'FAIL' },
    { name: 'Affected Surface Area', value: '1.8 m²', impact: 'Local Failure Points', status: 'WARNING' },
    { name: 'Affected Length (Total)', value: '124.4 m', impact: 'Linear Joint Stress', status: 'FAIL' },
    { name: 'Water Permeability', value: 'High Level', impact: 'Sub-base Layer Erosion Risk', status: 'CRITICAL' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-gray-800 text-amber-500 font-bold uppercase tracking-wider">
            <th className="pb-3 font-semibold">Metric</th>
            <th className="pb-3 font-semibold">Average Value</th>
            <th className="pb-3 font-semibold">Cumulative Impact</th>
            <th className="pb-3 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {tableData.map((row, idx) => (
            <tr key={idx} className="hover:bg-white/[0.02] transition">
              <td className="py-3.5 font-medium text-gray-200">{row.name}</td>
              <td className="py-3.5 text-gray-400">{row.value}</td>
              <td className="py-3.5 text-gray-500">{row.impact}</td>
              <td className="py-3.5 text-right">
                <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                  row.status === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                  row.status === 'FAIL' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefectTable;