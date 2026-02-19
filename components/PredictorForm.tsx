
import React from 'react';
import { LoanPredictors, EducationLevel, MaritalStatus, EmploymentStatus, LoanType } from '../types';

interface Props {
  onSubmit: (data: LoanPredictors) => void;
  isLoading: boolean;
}

const PredictorForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<LoanPredictors>({
    age: 35,
    loanAmount: 50000,
    loanTerm: 12,
    income: 25000,
    education: EducationLevel.Bachelor,
    gender: 'Male',
    maritalStatus: MaritalStatus.Single,
    employmentStatus: EmploymentStatus.LicensedProf,
    loanType: LoanType.Regular,
    loanAppType: 'New',
    modeOfPayment: 'Monthly'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'age' || name === 'loanAmount' || name === 'loanTerm' || name === 'income') 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Member Details</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Object.values(MaritalStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Education Attainment</label>
            <select name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Object.values(EducationLevel).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Loan Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Loan Request</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (₱)</label>
            <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loan Term (Months)</label>
            <input type="number" name="loanTerm" value={formData.loanTerm} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loan Type</label>
            <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Object.values(LoanType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
            <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              {Object.values(EmploymentStatus).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Financial Details */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income (₱)</label>
            <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Type</label>
            <select name="loanAppType" value={formData.loanAppType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="New">New Application</option>
              <option value="Renewal">Renewal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mode of Payment</label>
            <select name="modeOfPayment" value={formData.modeOfPayment} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
          isLoading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span>Analyzing Member Data...</span>
          </div>
        ) : "PREDICT LOAN PERFORMANCE"}
      </button>
    </form>
  );
};

export default PredictorForm;
