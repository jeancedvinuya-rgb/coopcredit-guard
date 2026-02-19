# CoopCredit Guard

**Predictors of Loan Default and Credit Performance Using Random Forest Algorithm**

A web-based predictive analytics tool designed to assist Multi-Purpose Cooperatives in evaluating loan applications. It uses a weighted heuristic scoring model — inspired by Random Forest classification — to predict the probability of loan default based on member data.

**Live App:** https://coopcredit-guard.vercel.app/

## Features

- **Loan Default Prediction** — Input member data and get instant risk analysis with default probability, credit score, and recommendations
- **Historical Logs** — All predictions are saved and viewable with full input/output details
- **Model Metrics** — Dashboard with risk distribution charts, feature importance, and breakdowns by age, employment, and education
- **Documentation** — In-app documentation covering the prediction model, input features, and output variables
- **Progressive Web App (PWA)** — Installable on Android and iOS for a native app experience

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Deployment | Vercel |
| App Type | PWA (Progressive Web App) |

## Input Predictors

The system accepts 11 input variables:

- **Member Details:** Age, Gender, Marital Status, Education Attainment
- **Loan Details:** Loan Amount, Loan Term, Loan Type, Employment Status
- **Financial Details:** Monthly Income, Application Type, Mode of Payment

## Prediction Output

| Output | Range |
|---|---|
| Default Probability | 0–100% |
| Credit Score | 300–850 |
| Risk Level | Low / Medium / High / Critical |
| Significant Factors | Top 3 predictors |
| Recommendation | Approve / Conditional / Review / Decline |

## Run Locally

**Prerequisites:** Node.js (v18+)

```bash
# Clone the repository
git clone https://github.com/jeancedvinuya-rgb/coopcredit-guard.git

# Install dependencies
cd coopcredit-guard
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:3000

## Install as Mobile App

**iPhone (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"

**Android (Chrome):**
1. Open the app URL in Google Chrome
2. Tap the three-dot menu (...)
3. Tap "Install app" or "Add to Home screen"

## Project Structure

```
coopcredit-guard/
├── index.html                  — Entry HTML with PWA meta tags
├── index.tsx                   — App bootstrap + service worker
├── App.tsx                     — Main app with page navigation
├── types.ts                    — TypeScript types and enums
├── components/
│   ├── PredictorForm.tsx       — Loan prediction input form
│   ├── ResultDisplay.tsx       — Prediction results with charts
│   ├── DocumentationPage.tsx   — System documentation page
│   ├── HistoricalLogsPage.tsx  — Prediction history viewer
│   └── ModelMetricsPage.tsx    — Analytics dashboard
├── services/
│   └── predictionService.ts    — Weighted scoring engine
└── public/
    ├── manifest.json           — PWA manifest
    ├── sw.js                   — Service worker
    └── icons/                  — App icons
```
