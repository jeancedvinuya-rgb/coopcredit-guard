
import React from 'react';
import { HistoryEntry } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  logs: HistoryEntry[];
}

const RISK_COLORS: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#ef4444',
  Critical: '#7f1d1d',
};

const ModelMetricsPage: React.FC<Props> = ({ logs }) => {
  // --- Compute metrics from history ---
  const totalPredictions = logs.length;

  const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  let totalDefault = 0;
  let totalCredit = 0;

  const ageBuckets: Record<string, { count: number; totalRisk: number }> = {
    '18-25': { count: 0, totalRisk: 0 },
    '26-35': { count: 0, totalRisk: 0 },
    '36-45': { count: 0, totalRisk: 0 },
    '46-55': { count: 0, totalRisk: 0 },
    '56+': { count: 0, totalRisk: 0 },
  };

  const employmentRisk: Record<string, { count: number; totalRisk: number }> = {};
  const educationRisk: Record<string, { count: number; totalRisk: number }> = {};
  const loanTypeRisk: Record<string, { count: number; totalRisk: number }> = {};

  logs.forEach(entry => {
    const r = entry.result;
    const inp = entry.input;

    riskCounts[r.riskLevel]++;
    totalDefault += r.defaultProbability;
    totalCredit += r.creditScore;

    // Age buckets
    const age = inp.age;
    const bucket = age <= 25 ? '18-25' : age <= 35 ? '26-35' : age <= 45 ? '36-45' : age <= 55 ? '46-55' : '56+';
    ageBuckets[bucket].count++;
    ageBuckets[bucket].totalRisk += r.defaultProbability;

    // Employment
    if (!employmentRisk[inp.employmentStatus]) employmentRisk[inp.employmentStatus] = { count: 0, totalRisk: 0 };
    employmentRisk[inp.employmentStatus].count++;
    employmentRisk[inp.employmentStatus].totalRisk += r.defaultProbability;

    // Education
    if (!educationRisk[inp.education]) educationRisk[inp.education] = { count: 0, totalRisk: 0 };
    educationRisk[inp.education].count++;
    educationRisk[inp.education].totalRisk += r.defaultProbability;

    // Loan type
    if (!loanTypeRisk[inp.loanType]) loanTypeRisk[inp.loanType] = { count: 0, totalRisk: 0 };
    loanTypeRisk[inp.loanType].count++;
    loanTypeRisk[inp.loanType].totalRisk += r.defaultProbability;
  });

  const avgDefault = totalPredictions > 0 ? (totalDefault / totalPredictions).toFixed(1) : '—';
  const avgCredit = totalPredictions > 0 ? Math.round(totalCredit / totalPredictions) : '—';
  const approvalRate = totalPredictions > 0 ? (((riskCounts.Low + riskCounts.Medium) / totalPredictions) * 100).toFixed(1) : '—';

  const riskDistData = Object.entries(riskCounts)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const ageChartData = Object.entries(ageBuckets)
    .filter(([_, v]) => v.count > 0)
    .map(([name, v]) => ({ name, avgRisk: Math.round(v.totalRisk / v.count), count: v.count }));

  const employmentChartData = Object.entries(employmentRisk)
    .map(([name, v]) => ({ name: name.length > 12 ? name.slice(0, 12) + '…' : name, fullName: name, avgRisk: Math.round(v.totalRisk / v.count), count: v.count }))
    .sort((a, b) => b.avgRisk - a.avgRisk);

  const educationChartData = Object.entries(educationRisk)
    .map(([name, v]) => ({ name, avgRisk: Math.round(v.totalRisk / v.count), count: v.count }))
    .sort((a, b) => b.avgRisk - a.avgRisk);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Model Metrics</h2>
        <p className="text-slate-500">Performance analytics and feature importance derived from prediction history</p>
      </div>

      {totalPredictions === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-400">No data yet</h3>
          <p className="text-sm text-slate-400 mt-1">Run some predictions first. Metrics will be computed from your prediction history.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-indigo-600">{totalPredictions}</p>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">Total Predictions</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-slate-800">{avgDefault}%</p>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">Avg Default Risk</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-indigo-600">{avgCredit}</p>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">Avg Credit Score</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-emerald-200 text-center">
              <p className="text-3xl font-bold text-emerald-600">{approvalRate}%</p>
              <p className="text-xs text-slate-500 font-medium uppercase mt-1">Approval Rate</p>
            </div>
          </div>

          {/* Risk Distribution + Model Weights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Distribution Pie */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Risk Level Distribution</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskDistData.map((entry) => (
                        <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {riskDistData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[d.name] }}></div>
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Importance (Model Weights) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Feature Importance (Weights)</h3>
              <div className="space-y-3">
                {[
                  { name: 'Debt-to-Income Ratio', weight: 30 },
                  { name: 'Employment Stability', weight: 15 },
                  { name: 'Age', weight: 10 },
                  { name: 'Education Level', weight: 10 },
                  { name: 'Loan Amount', weight: 10 },
                  { name: 'Application Type', weight: 8 },
                  { name: 'Loan Term', weight: 7 },
                  { name: 'Mode of Payment', weight: 5 },
                  { name: 'Marital Status', weight: 5 },
                ].map(f => (
                  <div key={f.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{f.name}</span>
                      <span className="text-slate-400">{f.weight}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${(f.weight / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Age vs Risk Bar Chart */}
          {ageChartData.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Average Default Risk by Age Group</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'avgRisk' ? `${value}%` : value,
                        name === 'avgRisk' ? 'Avg Default Risk' : 'Samples'
                      ]}
                    />
                    <Bar dataKey="avgRisk" fill="#818cf8" radius={[6, 6, 0, 0]} name="avgRisk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Employment & Education Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employmentChartData.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Risk by Employment Status</h3>
                <div className="space-y-3">
                  {employmentChartData.map(e => (
                    <div key={e.fullName}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{e.fullName}</span>
                        <span className="text-slate-500">{e.avgRisk}% avg ({e.count})</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${e.avgRisk}%`,
                            backgroundColor: e.avgRisk <= 25 ? '#10b981' : e.avgRisk <= 50 ? '#f59e0b' : '#ef4444',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {educationChartData.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Risk by Education Level</h3>
                <div className="space-y-3">
                  {educationChartData.map(e => (
                    <div key={e.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{e.name}</span>
                        <span className="text-slate-500">{e.avgRisk}% avg ({e.count})</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${e.avgRisk}%`,
                            backgroundColor: e.avgRisk <= 25 ? '#10b981' : e.avgRisk <= 50 ? '#f59e0b' : '#ef4444',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Model Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Model Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Model Type</span>
                  <span className="font-medium text-slate-800">Weighted Heuristic (Random Forest-inspired)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Number of Features</span>
                  <span className="font-medium text-slate-800">11 input predictors</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Risk Factors</span>
                  <span className="font-medium text-slate-800">9 weighted factors</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Output Range</span>
                  <span className="font-medium text-slate-800">0–100 (default probability)</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Credit Score Range</span>
                  <span className="font-medium text-slate-800">300–850</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Risk Levels</span>
                  <span className="font-medium text-slate-800">Low, Medium, High, Critical</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Primary Predictor</span>
                  <span className="font-medium text-slate-800">Debt-to-Income Ratio (~30%)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Data Persistence</span>
                  <span className="font-medium text-slate-800">Local storage (browser)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelMetricsPage;
