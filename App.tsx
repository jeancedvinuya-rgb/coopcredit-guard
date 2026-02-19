
import React, { useState } from 'react';
import PredictorForm from './components/PredictorForm';
import ResultDisplay from './components/ResultDisplay';
import DocumentationPage from './components/DocumentationPage';
import { LoanPredictors, PredictionResult } from './types';
import { getLoanPrediction } from './services/predictionService';

type Page = 'home' | 'documentation';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>('home');

  const handlePredict = async (data: LoanPredictors) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLoanPrediction(data);
      setPrediction(result);
      // Smooth scroll to result
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

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              CG
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-800 leading-none">CoopCredit Guard</h1>
              <span className="text-[10px] font-bold text-indigo-600 tracking-tighter uppercase">Random Forest Predictive Analytics</span>
            </div>
          </button>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <button
              onClick={() => navigate('documentation')}
              className={`hover:text-indigo-600 transition-colors cursor-pointer ${page === 'documentation' ? 'text-indigo-600' : ''}`}
            >
              Documentation
            </button>
            <span className="text-slate-300 cursor-default">Historical Logs</span>
            <span className="text-slate-300 cursor-default">Model Metrics</span>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden">
            <button
              onClick={() => navigate(page === 'documentation' ? 'home' : 'documentation')}
              className="text-sm font-medium text-indigo-600"
            >
              {page === 'documentation' ? 'Predictor' : 'Docs'}
            </button>
          </div>
        </div>
      </nav>

      {page === 'documentation' ? (
        <DocumentationPage />
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
