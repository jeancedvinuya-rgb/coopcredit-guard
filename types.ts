
export interface LoanPredictors {
  age: number;
  loanAmount: number;
  loanTerm: number;
  income: number;
  education: string;
  gender: string;
  maritalStatus: string;
  employmentStatus: string;
  loanType: string;
  loanAppType: string;
  modeOfPayment: string;
}

export interface PredictionResult {
  defaultProbability: number;
  creditScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  significantFactors: string[];
  recommendation: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  input: LoanPredictors;
  result: PredictionResult;
}

export enum EducationLevel {
  Elementary = 'Elementary',
  HighSchool = 'High School',
  Bachelor = 'Bachelor',
  Masteral = 'Masteral',
  Doctoral = 'Doctoral'
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Partnered = 'Partnered',
  Widowed = 'Widowed'
}

export enum EmploymentStatus {
  EmployedGov = 'Employed-Government',
  LicensedProf = 'Licensed Professional',
  Retired = 'Retired',
  SeamanOFW = 'Seaman/OFW',
  SelfEmployed = 'Self-employed'
}

export enum LoanType {
  Collateral = 'Collateral',
  Market = 'Market',
  MidYear = 'Mid-Year',
  Quick = 'Quick',
  Regular = 'Regular',
  Salary = 'Salary',
  Others = 'Others'
}
