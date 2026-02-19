
import React from 'react';
import { PredictionResult } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  result: PredictionResult;
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  const chartData = [
    { name: 'Risk', value: result.defaultProbability },
    { name: 'Safety', value: 100 - result.defaultProbability }
  ];

  const COLORS = [
    result.riskLevel === 'Low' ? '#10b981' : 
    result.riskLevel === 'Medium' ? '#f59e0b' : 
    result.riskLevel === 'High' ? '#ef4444' : '#7f1d1d',
    '#e2e8f0'
  ];

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Critical': return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Gauge Chart */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-3xl font-bold text-slate-800">{result.defaultProbability}%</span>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Default Risk</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Prediction Summary</h2>
                <p className="text-slate-500">AI-driven analysis based on Cooperative dataset</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getRiskBadgeColor(result.riskLevel)}`}>
                {result.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Credit Score</p>
                <p className="text-2xl font-bold text-indigo-600">{result.creditScore}</p>
              </div>
              <div className="p-4 bg-indigo-600 rounded-xl">
                <p className="text-xs text-indigo-100 uppercase font-bold">Safe Performance</p>
                <p className="text-2xl font-bold text-white">{100 - result.defaultProbability}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Significant Predictors (Feature Importance)
            </h4>
            <ul className="space-y-2">
              {result.significantFactors.map((factor, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-indigo-900 mb-2">Loan Officer Action</h4>
            <p className="text-sm text-indigo-800 italic leading-relaxed">
              &ldquo;{result.recommendation}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
