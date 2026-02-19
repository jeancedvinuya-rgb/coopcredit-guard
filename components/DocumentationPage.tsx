
import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">{title}</h3>
    {children}
  </div>
);

const Table: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-indigo-50">
          {headers.map((h, i) => (
            <th key={i} className="text-left px-4 py-2 font-semibold text-indigo-900 border-b border-slate-200">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-slate-700 border-b border-slate-100">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Documentation</h2>
        <p className="text-slate-500">System documentation for CoopCredit Guard — Random Forest Predictive Analytics</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">

        <Section title="1. Project Overview">
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>CoopCredit Guard</strong> is a web-based predictive analytics tool designed to assist Multi-Purpose Cooperatives
            in evaluating loan applications. It uses a weighted heuristic scoring model — inspired by Random Forest classification —
            to predict the probability of loan default based on member data.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Full Title:</strong> Predictors of Loan Default and Credit Performance Using Random Forest Algorithm
          </p>
        </Section>

        <Section title="2. Objectives">
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>To identify significant predictors of loan default and credit performance in Multi-Purpose Cooperatives</li>
            <li>To provide loan officers with a data-driven decision support tool</li>
            <li>To reduce non-performing loans through early risk identification</li>
            <li>To improve financial sustainability of cooperative lending operations</li>
          </ul>
        </Section>

        <Section title="3. Technology Stack">
          <Table
            headers={['Component', 'Technology']}
            rows={[
              ['Frontend Framework', 'React 19 with TypeScript'],
              ['Build Tool', 'Vite 6'],
              ['Styling', 'Tailwind CSS'],
              ['Charts', 'Recharts'],
              ['Deployment', 'Vercel (HTTPS)'],
              ['App Type', 'Progressive Web App (PWA)'],
            ]}
          />
        </Section>

        <Section title="4. Input Predictors (Features)">
          <p className="text-sm text-slate-500 font-medium mb-2">The system accepts 11 input variables grouped into three categories:</p>

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Member Details</h4>
          <Table
            headers={['Predictor', 'Data Type', 'Values']}
            rows={[
              ['Age', 'Number', 'Any positive integer'],
              ['Gender', 'Categorical', 'Male, Female'],
              ['Marital Status', 'Categorical', 'Single, Married, Partnered, Widowed'],
              ['Education Attainment', 'Categorical', 'Elementary, High School, Bachelor, Masteral, Doctoral'],
            ]}
          />

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Loan Request Details</h4>
          <Table
            headers={['Predictor', 'Data Type', 'Values']}
            rows={[
              ['Loan Amount (₱)', 'Number', 'Any positive number'],
              ['Loan Term (Months)', 'Number', 'Any positive integer'],
              ['Loan Type', 'Categorical', 'Collateral, Market, Mid-Year, Quick, Regular, Salary, Others'],
              ['Employment Status', 'Categorical', 'Employed-Government, Licensed Professional, Retired, Seaman/OFW, Self-employed'],
            ]}
          />

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Financial Details</h4>
          <Table
            headers={['Predictor', 'Data Type', 'Values']}
            rows={[
              ['Monthly Income (₱)', 'Number', 'Any positive number'],
              ['Application Type', 'Categorical', 'New Application, Renewal'],
              ['Mode of Payment', 'Categorical', 'Monthly, Quarterly, Weekly'],
            ]}
          />
        </Section>

        <Section title="5. Prediction Model">
          <p className="text-sm text-slate-600 leading-relaxed">
            The prediction engine uses a <strong>weighted heuristic scoring model</strong> that assigns risk points across 9 factors.
            Each factor contributes a weighted score to a cumulative risk total (0–100 scale).
          </p>

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Risk Factors and Weights</h4>
          <Table
            headers={['Factor', 'Weight', 'Description']}
            rows={[
              ['Debt-to-Income Ratio', '~30%', 'Loan amount ÷ (monthly income × loan term). Strongest predictor.'],
              ['Employment Stability', '~15%', 'Government and licensed professionals are lowest risk.'],
              ['Age', '~10%', 'Members aged 30–55 are lowest risk.'],
              ['Education Level', '~10%', 'Higher education correlates with lower default risk.'],
              ['Loan Amount', '~10%', 'Larger loans carry higher risk.'],
              ['Application Type', '~8%', 'Renewal applications indicate positive repayment history.'],
              ['Loan Term', '~7%', 'Longer terms carry slightly higher risk.'],
              ['Mode of Payment', '~5%', 'Weekly payments correlate with lower risk than quarterly.'],
              ['Marital Status', '~5%', 'Married members show slightly lower default rates.'],
            ]}
          />

          <div className="bg-slate-50 rounded-xl p-4 mt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Debt-to-Income (DTI) Formula</h4>
            <p className="text-sm text-slate-600 font-mono bg-white px-3 py-2 rounded border border-slate-200 inline-block">
              DTI = Loan Amount ÷ (Monthly Income × Loan Term)
            </p>
            <div className="mt-3 text-sm text-slate-600 space-y-1">
              <p>• DTI &gt; 0.6 → High risk (+30 points)</p>
              <p>• DTI &gt; 0.4 → Elevated risk (+20 points)</p>
              <p>• DTI &gt; 0.25 → Moderate risk (+10 points)</p>
              <p>• DTI ≤ 0.25 → Low risk (+3 points)</p>
            </div>
          </div>
        </Section>

        <Section title="6. Output Variables">
          <Table
            headers={['Output', 'Range', 'Description']}
            rows={[
              ['Default Probability', '0–100%', 'Likelihood that the borrower will default'],
              ['Credit Score', '300–850', 'Inversely derived from default probability'],
              ['Risk Level', 'Low / Medium / High / Critical', 'Categorical risk classification'],
              ['Significant Factors', 'Top 3 factors', 'Most influential predictors for this member'],
              ['Recommendation', 'Text', 'Suggested action for the loan officer'],
            ]}
          />

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Risk Level Thresholds</h4>
          <Table
            headers={['Risk Level', 'Default Probability', 'Credit Score Range']}
            rows={[
              ['Low', '0–25%', '713–850'],
              ['Medium', '26–50%', '575–712'],
              ['High', '51–75%', '438–574'],
              ['Critical', '76–100%', '300–437'],
            ]}
          />

          <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-4">Recommendations</h4>
          <Table
            headers={['Risk Level', 'Recommendation']}
            rows={[
              ['Low', 'Approve — strong creditworthiness with favorable debt-to-income ratio'],
              ['Medium', 'Conditional approval — consider requiring a co-maker or reducing loan amount'],
              ['High', 'Further review — evaluate additional collateral or alternative repayment terms'],
              ['Critical', 'Decline or restructure — recommend financial counseling before reapplication'],
            ]}
          />
        </Section>

        <Section title="7. Progressive Web App (PWA)">
          <p className="text-sm text-slate-600 leading-relaxed">
            The system is deployed as a Progressive Web App, allowing users to install it on mobile devices
            for a native app-like experience.
          </p>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mt-2">
            <li>Installable on Android and iOS home screens</li>
            <li>Standalone display (no browser bars)</li>
            <li>Offline caching via service worker</li>
            <li>Custom app icon (shield with checkmark)</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">iPhone (Safari)</h4>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                <li>Open the app URL in Safari</li>
                <li>Tap the Share button (square with arrow)</li>
                <li>Scroll down, tap "Add to Home Screen"</li>
                <li>Tap Add</li>
              </ol>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Android (Chrome)</h4>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                <li>Open the app URL in Google Chrome</li>
                <li>Tap the three-dot menu at the top right</li>
                <li>Tap "Install app" or "Add to Home screen"</li>
                <li>Tap Install</li>
              </ol>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
};

export default DocumentationPage;
