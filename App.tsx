
import React, { useState, useEffect } from 'react';
import PredictorForm from './components/PredictorForm';
import ResultDisplay from './components/ResultDisplay';
import DocumentationPage from './components/DocumentationPage';
import HistoricalLogsPage from './components/HistoricalLogsPage';
import ModelMetricsPage from './components/ModelMetricsPage';
import { LoanPredictors, PredictionResult, HistoryEntry } from './types';
import { getLoanPrediction } from './services/predictionService';

type Page = 'home' | 'documentation' | 'logs' | 'metrics';

const STORAGE_KEY = 'coopcredit-guard-history';

const loadHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('home');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [lastInput, setLastInput] = useState<LoanPredictors | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handlePredict = async (data: LoanPredictors) => {
    setLoading(true);
    setError(null);
    setLastInput(data);
    try {
      const result = await getLoanPrediction(data);
      setPrediction(result);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        input: data,
        result,
      };
      setHistory(prev => [...prev, entry]);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
              CG
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-800 leading-none">CoopCredit Guard</h1>
              <span className="text-[10px] font-bold text-indigo-600 tracking-tighter uppercase">Random Forest Predictive Analytics</span>
            </div>
          </button>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <button
              onClick={() => navigate('documentation')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${page === 'documentation' ? 'text-indigo-600' : ''}`}
            >
              Documentation
            </button>
            <button
              onClick={() => navigate('logs')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer relative ${page === 'logs' ? 'text-indigo-600' : ''}`}
            >
              Historical Logs
              {history.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('metrics')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${page === 'metrics' ? 'text-indigo-600' : ''}`}
            >
              Model Metrics
            </button>
          </div>
          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className={`block w-5 h-0.5 bg-slate-600 rounded transition-all ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-slate-600 rounded mt-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-slate-600 rounded mt-1 transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            {!menuOpen && history.length > 0 && (
              <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
            {([
              { id: 'home' as Page, label: 'Predictor', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
              { id: 'logs' as Page, label: 'Historical Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'metrics' as Page, label: 'Model Metrics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { id: 'documentation' as Page, label: 'Documentation', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            ]).map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors ${
                  page === item.id
                    ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                </svg>
                {item.label}
                {item.id === 'logs' && history.length > 0 && (
                  <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </nav>
      {/* Overlay to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}></div>
      )}

      {page === 'documentation' ? (
        <DocumentationPage />
      ) : page === 'logs' ? (
        <HistoricalLogsPage logs={history} onClear={clearHistory} />
      ) : page === 'metrics' ? (
        <ModelMetricsPage logs={history} />
      ) : (
        <main className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
          {/* Intro */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Predict Loan Default <span className="text-indigo-600">Instantly</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Harness the power of Random Forest predictors to identify high-risk loan applications before they happen. Input member data to see performance probabilities.
            </p>
          </div>

          {/* Prediction Form Section */}
          <section>
            <PredictorForm onSubmit={handlePredict} isLoading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}
          </section>

          {/* Result Section */}
          <div id="result-section">
            {prediction && <ResultDisplay result={prediction} />}
          </div>

          {/* Thesis Footer Branding */}
          <div className="pt-20 border-t border-slate-200">
            <div className="bg-indigo-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-bold italic opacity-80">Thesis Project Focus</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Primary Objective</div>
                    <p className="text-sm opacity-90 text-indigo-50">To identify significant predictors of loan default and credit performance using Random Forest algorithms.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Methodology</div>
                    <p className="text-sm opacity-90 text-indigo-50">Feature engineering from Cooperative member databases, utilizing Income, Age, and Loan History as key metrics.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Impact</div>
                    <p className="text-sm opacity-90 text-indigo-50">Improved decision-making for Multi-Purpose Cooperatives to ensure financial sustainability.</p>
                  </div>
                </div>
              </div>
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-12 -mt-12 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 -ml-12 -mb-12 rounded-full blur-3xl"></div>
            </div>
          </div>
        </main>
      )}

      <footer className="mt-20 text-center py-10 border-t border-slate-200">
        <p className="text-slate-400 text-xs font-medium">PREDICTORS OF LOAN DEFAULT AND CREDIT PERFORMANCE &copy; 2025 Multi-Purpose Cooperative Thesis Tool</p>
      </footer>
    </div>
  );
};

export default App;
