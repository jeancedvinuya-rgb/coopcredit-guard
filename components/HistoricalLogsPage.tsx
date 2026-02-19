
import React, { useState } from 'react';
import { HistoryEntry } from '../types';

interface Props {
  logs: HistoryEntry[];
  onClear: () => void;
}

const getRiskBadge = (level: string) => {
  switch (level) {
    case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Critical': return 'bg-red-200 text-red-900 border-red-300';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const HistoricalLogsPage: React.FC<Props> = ({ logs, onClear }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Historical Logs</h2>
          <p className="text-slate-500">Record of all prediction analyses performed during this session</p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Summary Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-indigo-600">{logs.length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Analyses</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-emerald-200 text-center">
            <p className="text-2xl font-bold text-emerald-600">{logs.filter(l => l.result.riskLevel === 'Low').length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Low Risk</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-200 text-center">
            <p className="text-2xl font-bold text-amber-600">{logs.filter(l => l.result.riskLevel === 'Medium').length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">Medium Risk</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-rose-200 text-center">
            <p className="text-2xl font-bold text-rose-600">{logs.filter(l => l.result.riskLevel === 'High' || l.result.riskLevel === 'Critical').length}</p>
            <p className="text-xs text-slate-500 font-medium uppercase">High / Critical</p>
          </div>
        </div>
      )}

      {/* Log Entries */}
      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-400">No predictions yet</h3>
          <p className="text-sm text-slate-400 mt-1">Go back to the Predictor and analyze a member's loan application. Results will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...logs].reverse().map((entry, index) => (
            <div key={entry.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Row Header */}
              <button
                onClick={() => toggle(entry.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 w-8">#{logs.length - index}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">
                      {entry.input.gender}, {entry.input.age} yrs — ₱{entry.input.loanAmount.toLocaleString()} ({entry.input.loanType})
                    </p>
                    <p className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(entry.result.riskLevel)}`}>
                    {entry.result.riskLevel}
                  </span>
                  <span className="text-sm font-bold text-slate-700">{entry.result.defaultProbability}%</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === entry.id && (
                <div className="px-6 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Credit Score</p>
                      <p className="text-lg font-bold text-indigo-600">{entry.result.creditScore}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Default Probability</p>
                      <p className="text-lg font-bold text-slate-800">{entry.result.defaultProbability}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Safe Performance</p>
                      <p className="text-lg font-bold text-emerald-600">{100 - entry.result.defaultProbability}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Input Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div><span className="text-slate-400">Age:</span> <span className="font-medium text-slate-700">{entry.input.age}</span></div>
                      <div><span className="text-slate-400">Gender:</span> <span className="font-medium text-slate-700">{entry.input.gender}</span></div>
                      <div><span className="text-slate-400">Status:</span> <span className="font-medium text-slate-700">{entry.input.maritalStatus}</span></div>
                      <div><span className="text-slate-400">Education:</span> <span className="font-medium text-slate-700">{entry.input.education}</span></div>
                      <div><span className="text-slate-400">Income:</span> <span className="font-medium text-slate-700">₱{entry.input.income.toLocaleString()}</span></div>
                      <div><span className="text-slate-400">Loan:</span> <span className="font-medium text-slate-700">₱{entry.input.loanAmount.toLocaleString()}</span></div>
                      <div><span className="text-slate-400">Term:</span> <span className="font-medium text-slate-700">{entry.input.loanTerm} months</span></div>
                      <div><span className="text-slate-400">Employment:</span> <span className="font-medium text-slate-700">{entry.input.employmentStatus}</span></div>
                      <div><span className="text-slate-400">Loan Type:</span> <span className="font-medium text-slate-700">{entry.input.loanType}</span></div>
                      <div><span className="text-slate-400">App Type:</span> <span className="font-medium text-slate-700">{entry.input.loanAppType}</span></div>
                      <div><span className="text-slate-400">Payment:</span> <span className="font-medium text-slate-700">{entry.input.modeOfPayment}</span></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Significant Factors</p>
                    <ul className="space-y-1">
                      {entry.result.significantFactors.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-[10px] text-indigo-500 uppercase font-bold mb-1">Recommendation</p>
                    <p className="text-sm text-indigo-800 italic">&ldquo;{entry.result.recommendation}&rdquo;</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalLogsPage;
