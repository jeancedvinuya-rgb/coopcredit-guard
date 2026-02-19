
import { LoanPredictors, PredictionResult } from "../types";

/**
 * Local heuristic-based loan prediction.
 * Scores risk factors on a 0–100 scale based on cooperative lending patterns.
 */
export const getLoanPrediction = async (predictors: LoanPredictors): Promise<PredictionResult> => {
  // --- Weighted risk scoring ---
  let riskScore = 0;

  // 1. Debt-to-income ratio (strongest predictor, weight ~30%)
  const dti = predictors.loanAmount / (predictors.income * predictors.loanTerm || 1);
  if (dti > 0.6) riskScore += 30;
  else if (dti > 0.4) riskScore += 20;
  else if (dti > 0.25) riskScore += 10;
  else riskScore += 3;

  // 2. Age factor (weight ~10%)
  if (predictors.age < 25) riskScore += 10;
  else if (predictors.age < 30) riskScore += 6;
  else if (predictors.age <= 55) riskScore += 2;
  else riskScore += 7;

  // 3. Employment stability (weight ~15%)
  const stableJobs = ["Employed-Government", "Employed-Private", "Licensed Professional"];
  const moderateJobs = ["Self-employed", "Seaman/OFW"];
  if (stableJobs.includes(predictors.employmentStatus)) riskScore += 2;
  else if (moderateJobs.includes(predictors.employmentStatus)) riskScore += 8;
  else riskScore += 15; // Retired or other

  // 4. Education level (weight ~10%)
  const eduMap: Record<string, number> = {
    Doctoral: 1, Masteral: 2, Bachelor: 4, "High School": 8, Elementary: 10,
  };
  riskScore += eduMap[predictors.education] ?? 5;

  // 5. Loan amount magnitude (weight ~10%)
  if (predictors.loanAmount > 200000) riskScore += 10;
  else if (predictors.loanAmount > 100000) riskScore += 6;
  else if (predictors.loanAmount > 50000) riskScore += 3;
  else riskScore += 1;

  // 6. Application type (weight ~8%)
  riskScore += predictors.loanAppType === "Renewal" ? 1 : 8;

  // 7. Loan term length (weight ~7%)
  if (predictors.loanTerm > 36) riskScore += 7;
  else if (predictors.loanTerm > 18) riskScore += 4;
  else riskScore += 1;

  // 8. Mode of payment (weight ~5%)
  if (predictors.modeOfPayment === "Weekly") riskScore += 1;
  else if (predictors.modeOfPayment === "Monthly") riskScore += 3;
  else riskScore += 5; // Quarterly

  // 9. Marital status (weight ~5%)
  if (predictors.maritalStatus === "Married") riskScore += 1;
  else if (predictors.maritalStatus === "Single") riskScore += 4;
  else riskScore += 3;

  // Clamp to 0-100
  const defaultProbability = Math.max(0, Math.min(100, Math.round(riskScore)));

  // Derive credit score (inversely correlated, 300-850 range)
  const creditScore = Math.round(850 - (defaultProbability / 100) * 550);

  // Risk level thresholds
  let riskLevel: PredictionResult["riskLevel"];
  if (defaultProbability <= 25) riskLevel = "Low";
  else if (defaultProbability <= 50) riskLevel = "Medium";
  else if (defaultProbability <= 75) riskLevel = "High";
  else riskLevel = "Critical";

  // --- Build significant factors (top 3) ---
  const factors: { label: string; weight: number }[] = [];

  factors.push({
    label: `Debt-to-income ratio is ${dti.toFixed(2)} (${dti > 0.4 ? "high" : dti > 0.25 ? "moderate" : "healthy"})`,
    weight: dti > 0.4 ? 3 : dti > 0.25 ? 2 : 1,
  });

  factors.push({
    label: `Employment: ${predictors.employmentStatus} (${stableJobs.includes(predictors.employmentStatus) ? "stable" : "moderate risk"})`,
    weight: stableJobs.includes(predictors.employmentStatus) ? 1 : 2,
  });

  factors.push({
    label: `${predictors.loanAppType === "Renewal" ? "Renewal application — positive repayment history" : "New application — no prior repayment history"}`,
    weight: predictors.loanAppType === "Renewal" ? 1 : 2,
  });

  factors.push({
    label: `Education level: ${predictors.education}`,
    weight: (eduMap[predictors.education] ?? 5) > 5 ? 2 : 1,
  });

  factors.push({
    label: `Loan amount ₱${predictors.loanAmount.toLocaleString()} over ${predictors.loanTerm} months`,
    weight: predictors.loanAmount > 100000 ? 2 : 1,
  });

  // Sort by weight descending and take top 3
  factors.sort((a, b) => b.weight - a.weight);
  const significantFactors = factors.slice(0, 3).map((f) => f.label);

  // --- Recommendation ---
  let recommendation: string;
  if (riskLevel === "Low") {
    recommendation = "Approve — the member demonstrates strong creditworthiness with a favorable debt-to-income ratio and stable profile.";
  } else if (riskLevel === "Medium") {
    recommendation = "Conditional approval — consider requiring a co-maker or reducing the loan amount to mitigate moderate risk exposure.";
  } else if (riskLevel === "High") {
    recommendation = "Further review required — the high risk indicators suggest the loan committee should evaluate additional collateral or alternative repayment terms.";
  } else {
    recommendation = "Decline or restructure — critical risk level detected. Recommend financial counseling before reapplication.";
  }

  // Simulate a brief processing delay for UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    defaultProbability,
    creditScore,
    riskLevel,
    significantFactors,
    recommendation,
  };
};
