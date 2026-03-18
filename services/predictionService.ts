
import { LoanPredictors, PredictionResult } from "../types";

/**
 * Normalize input values to handle inconsistencies from processed_credit_performance dataset.
 * Fixes known data quality issues: "Mid-year" → "Mid-Year", "REgular" → "Regular".
 */
const normalizeLoanType = (loanType: string): string => {
  const normalized: Record<string, string> = {
    "Mid-year": "Mid-Year",
    "REgular": "Regular",
  };
  return normalized[loanType] ?? loanType;
};

/**
 * Local heuristic-based loan prediction.
 * Scores risk factors on a 0–100 scale based on cooperative lending patterns.
 */
export const getLoanPrediction = async (predictors: LoanPredictors): Promise<PredictionResult> => {
  // --- Age validation ---
  if (predictors.age < 18) {
    throw new Error('Age must be 18 or above.');
  }

  // Normalize inputs to match processed_credit_performance dataset
  const loanType = normalizeLoanType(predictors.loanType);

  // --- Weighted risk scoring (aligned with processed_credit_performance dataset) ---
  // Weights derived from credit performance spread analysis across 1,599 records.
  // Lower avg credit performance = higher risk score for that category.
  let riskScore = 0;

  // 1. Employment stability (weight ~16% — strongest predictor per dataset)
  // Data: Licensed Prof 0.786, Employed-Private 0.707, Retired 0.663, Self-employed 0.621, Seaman/OFW 0.584, Employed-Gov 0.541
  const lowRiskJobs = ["Licensed Professional", "Employed-Private"];
  const moderateJobs = ["Retired", "Self-employed"];
  if (lowRiskJobs.includes(predictors.employmentStatus)) riskScore += 3;
  else if (moderateJobs.includes(predictors.employmentStatus)) riskScore += 9;
  else riskScore += 14; // Seaman/OFW, Employed-Government

  // 2. Loan type (weight ~12%)
  // Data: Quick 0.773, Salary 0.750, Others 0.644, Collateral 0.625, Regular 0.589, Market 0.500
  const lowRiskLoans = ["Quick", "Salary"];
  const moderateRiskLoans = ["Others", "Collateral"];
  if (lowRiskLoans.includes(loanType)) riskScore += 2;
  else if (moderateRiskLoans.includes(loanType)) riskScore += 6;
  else riskScore += 12; // Regular, Market, Mid-Year

  // 3. Debt-to-income ratio (weight ~12%)
  const dti = predictors.loanAmount / (predictors.income * predictors.loanTerm || 1);
  if (dti > 0.6) riskScore += 12;
  else if (dti > 0.4) riskScore += 8;
  else if (dti > 0.25) riskScore += 4;
  else riskScore += 1;

  // 4. Mode of payment (weight ~12%)
  // Data: Quarterly 0.795, Weekly 0.630, Monthly 0.623
  if (predictors.modeOfPayment === "Quarterly") riskScore += 1;
  else if (predictors.modeOfPayment === "Weekly") riskScore += 6;
  else riskScore += 12; // Monthly

  // 5. Education level (weight ~11%)
  // Data: High School 0.667, Bachelor 0.632, Masteral 0.600, Elementary 0.522, Doctoral 0.500
  const eduMap: Record<string, number> = {
    "High School": 2, Bachelor: 5, Masteral: 7, Elementary: 9, Doctoral: 11,
  };
  riskScore += eduMap[predictors.education] ?? 5;

  // 6. Loan term length (weight ~11%)
  // Data: <=18mo 0.678, >36mo 0.611, 18-36mo 0.512
  if (predictors.loanTerm <= 18) riskScore += 2;
  else if (predictors.loanTerm > 36) riskScore += 6;
  else riskScore += 11; // 18-36 months is highest risk per dataset

  // 7. Age factor (weight ~10%)
  // Data: 18-25 0.727, 56+ 0.687, 46-55 0.612, 26-35 0.595, 36-45 0.584
  if (predictors.age <= 25) riskScore += 2;
  else if (predictors.age > 55) riskScore += 4;
  else if (predictors.age > 45) riskScore += 6;
  else if (predictors.age <= 35) riskScore += 8;
  else riskScore += 10; // 36-45 is highest risk per dataset

  // 8. Loan amount magnitude (weight ~7%)
  // Data: <=50K 0.658, >200K 0.625, 50K-100K 0.602, 100K-200K 0.556
  if (predictors.loanAmount <= 50000) riskScore += 1;
  else if (predictors.loanAmount > 200000) riskScore += 3;
  else if (predictors.loanAmount <= 100000) riskScore += 5;
  else riskScore += 7; // 100K-200K

  // 9. Application type (weight ~7%)
  // Data: New 0.694, Renewal 0.597
  riskScore += predictors.loanAppType === "New" ? 1 : 7;

  // 10. Marital status (weight ~2%)
  // Data: Widowed 0.656, Single 0.641, Married 0.627
  if (predictors.maritalStatus === "Widowed") riskScore += 0;
  else if (predictors.maritalStatus === "Single") riskScore += 1;
  else riskScore += 2; // Married, Partnered

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
    label: `Employment: ${predictors.employmentStatus} (${lowRiskJobs.includes(predictors.employmentStatus) ? "low risk" : moderateJobs.includes(predictors.employmentStatus) ? "moderate risk" : "higher risk"})`,
    weight: lowRiskJobs.includes(predictors.employmentStatus) ? 1 : 3,
  });

  factors.push({
    label: `Loan type: ${loanType} (${lowRiskLoans.includes(loanType) ? "low risk" : moderateRiskLoans.includes(loanType) ? "moderate" : "higher risk"})`,
    weight: lowRiskLoans.includes(loanType) ? 1 : 3,
  });

  factors.push({
    label: `Debt-to-income ratio is ${dti.toFixed(2)} (${dti > 0.4 ? "high" : dti > 0.25 ? "moderate" : "healthy"})`,
    weight: dti > 0.4 ? 3 : dti > 0.25 ? 2 : 1,
  });

  factors.push({
    label: `Payment: ${predictors.modeOfPayment} (${predictors.modeOfPayment === "Quarterly" ? "lowest risk" : "standard"})`,
    weight: predictors.modeOfPayment === "Quarterly" ? 1 : 2,
  });

  factors.push({
    label: `Education level: ${predictors.education}`,
    weight: (eduMap[predictors.education] ?? 5) > 5 ? 2 : 1,
  });

  factors.push({
    label: `Loan amount ₱${predictors.loanAmount.toLocaleString()} over ${predictors.loanTerm} months`,
    weight: predictors.loanAmount > 100000 ? 2 : 1,
  });

  factors.push({
    label: `${predictors.loanAppType === "Renewal" ? "Renewal application — higher risk per dataset trends" : "New application — lower risk per dataset trends"}`,
    weight: predictors.loanAppType === "Renewal" ? 2 : 1,
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
