import { createContext, useState, useContext } from 'react';

// Alternative investment options (mimicking the Python version)
export const ALT_INVESTMENTS = {
  "0.5% (Savings Account)": 0.5,
  "1.1% (10 Year CDs)": 1.1,
  "1.8% (SP500 Dividends)": 1.8,
  "2.5% (Money Market)": 2.5,
  "4.3% (10 Year US Treasury)": 4.3,
  "4.4% (30 Year US Treasury)": 4.4,
  "7.0% (SP500)": 7.0,
};

// Default state values
const defaultState = {
  // Mortgage related
  homePrice: 300000,
  rehab: 1000,
  downPayment: 50000,
  closingCostsRate: 3.0,
  interestRate: 6.5,
  pmiRate: 0.5,
  
  // Property expenses
  yrPropertyTaxRate: 1.0,
  yrHomeAppreciation: 3.0,
  yrInsuranceRate: 0.35,
  moHoaFees: 0,
  yrMaintenance: 1.5,
  yrInflationRate: 3.0,
  
  // Rental income
  moRentIncome: 0,
  moOtherIncome: 0,
  yrRentIncrease: 3.0,
  moUtility: 200,
  managementRate: 10.0,
  vacancyRate: 5.0,
  
  // Other settings
  paydownWithProfit: false,
  rentExp: 1500,
  xlim: 30,
  chartMode: "Lines",
  
  // Tax & selling
  capitalGainsTaxRate: 15.0,
  incomeTaxRate: 25.0,
  realtorRate: 6.0,
  
  // Extra payments
  moExtraPayment: 300,
  numExtraPayments: 12,
  
  // Investment alternatives
  extraPaymentsPortfolioGrowth: Object.keys(ALT_INVESTMENTS)[0],
  rentSurplusPortfolioGrowth: Object.keys(ALT_INVESTMENTS)[0],
};

// Create the context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  
  // Function to reset all state to defaults
  const resetState = () => {
    setState(defaultState);
  };
  
  // Function to update a specific field
  const updateField = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };
  
  // Calculate the actual percentage values for rate fields
  const getPercentValue = (field) => {
    if (field.includes('Growth')) {
      return ALT_INVESTMENTS[state[field]] / 100;
    }
    return state[field] / 100;
  };
  
  // Create the value object with all the state and helper functions
  const value = {
    ...state,
    resetState,
    updateField,
    // Helper to easily access percentage values
    rates: {
      closingCostsRate: getPercentValue('closingCostsRate'),
      interestRate: getPercentValue('interestRate'),
      pmiRate: getPercentValue('pmiRate'),
      yrPropertyTaxRate: getPercentValue('yrPropertyTaxRate'),
      yrHomeAppreciation: getPercentValue('yrHomeAppreciation'),
      yrInsuranceRate: getPercentValue('yrInsuranceRate'),
      yrMaintenance: getPercentValue('yrMaintenance'),
      yrInflationRate: getPercentValue('yrInflationRate'),
      yrRentIncrease: getPercentValue('yrRentIncrease'),
      managementRate: getPercentValue('managementRate'),
      vacancyRate: getPercentValue('vacancyRate'),
      capitalGainsTaxRate: getPercentValue('capitalGainsTaxRate'),
      incomeTaxRate: getPercentValue('incomeTaxRate'),
      realtorRate: getPercentValue('realtorRate'),
      extraPaymentsPortfolioGrowth: getPercentValue('extraPaymentsPortfolioGrowth'),
      rentSurplusPortfolioGrowth: getPercentValue('rentSurplusPortfolioGrowth'),
    }
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 