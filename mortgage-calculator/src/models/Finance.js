/**
 * Financial calculations helper functions
 * Based on the Python implementation in utils_finance.py
 */

/**
 * Calculate the monthly mortgage payment
 * @param {number} loanAmount - Total loan amount
 * @param {number} interestRate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} years - Loan term in years (default: 30)
 * @returns {number} - Monthly payment amount
 */
export const getAmortizationPayment = (loanAmount, interestRate, years = 30) => {
  const monthlyRate = interestRate / 12;
  const nPayments = years * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / 
    (Math.pow(1 + monthlyRate, nPayments) - 1);
  return monthlyPayment;
};

/**
 * Calculate the total interest paid over the life of the loan
 * @param {number} loanAmount - Total loan amount
 * @param {number} interestRate - Annual interest rate (as decimal)
 * @param {number} years - Loan term in years (default: 30)
 * @returns {number} - Total interest paid
 */
export const getTotalInterestPaid = (loanAmount, interestRate, years = 30) => {
  const totalPaid = getAmortizationPayment(loanAmount, interestRate, years) * years * 12;
  return totalPaid - loanAmount;
};

/**
 * Calculate the value of an asset after a number of months with growth
 * @param {number} value - Initial value
 * @param {number} yearlyGrowthRate - Annual growth rate (as decimal)
 * @param {number} months - Number of months
 * @param {number} monthlyContribution - Monthly contribution to value (default: 0)
 * @returns {number} - Final value after growth
 */
export const addGrowth = (value, yearlyGrowthRate, months, monthlyContribution = 0) => {
  // Helper function for monthly growth calculation
  const monthlyGrowth = (val, rate, months) => {
    return val * Math.pow(1 + rate, months / 12);
  };

  if (monthlyContribution === 0) {
    return monthlyGrowth(value, yearlyGrowthRate, months);
  } else {
    let totalValue = value;
    
    for (let i = 0; i < months; i++) {
      totalValue = monthlyGrowth(totalValue, yearlyGrowthRate, 1) + monthlyContribution;
    }
    
    return totalValue;
  }
};

/**
 * Determine if PMI should be cancelled based on equity
 * @param {number} homeValue - Current home value
 * @param {number} loanBalance - Current loan balance
 * @returns {boolean} - True if PMI should be cancelled
 */
export const cancelPmiFromEquity = (homeValue, loanBalance) => {
  const equity = homeValue - loanBalance;
  return equity >= 0.2 * homeValue;
};

/**
 * Determine if PMI should be cancelled based on loan balance compared to initial value
 * @param {number} initHomeValue - Initial home value
 * @param {number} loanBalance - Current loan balance
 * @returns {boolean} - True if PMI should be cancelled
 */
export const cancelPmiFromLoanBalance = (initHomeValue, loanBalance) => {
  return loanBalance <= (0.8 * initHomeValue);
};

/**
 * Calculate monthly PMI amount
 * @param {number} homeValue - Current home value
 * @param {number} loanBalance - Current loan balance
 * @param {number} pmiRate - Annual PMI rate (as decimal)
 * @param {number} initHomeValue - Initial home value
 * @returns {number} - Monthly PMI payment (0 if PMI should be cancelled)
 */
export const getMonthlyPmi = (homeValue, loanBalance, pmiRate, initHomeValue) => {
  if (cancelPmiFromEquity(homeValue, loanBalance) || 
      cancelPmiFromLoanBalance(initHomeValue, loanBalance)) {
    return 0;
  } else {
    return (loanBalance * pmiRate) / 12;
  }
};

/**
 * Calculate the internal rate of return (IRR)
 * Basic implementation - for complex scenarios, use a financial library
 * @param {Array} cashflows - Array of cash flows (negative for outflows, positive for inflows)
 * @param {number} guess - Initial guess for IRR (default: 0.1)
 * @returns {number} - Estimated IRR
 */
export const calculateIRR = (cashflows, guess = 0.1) => {
  const maxIterations = 1000;
  const precision = 0.00001;
  let rate = guess;
  
  // Simple Newton-Raphson method for finding IRR
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    
    for (let j = 0; j < cashflows.length; j++) {
      npv += cashflows[j] / Math.pow(1 + rate, j);
      derivative += -j * cashflows[j] / Math.pow(1 + rate, j + 1);
    }
    
    const newRate = rate - npv / derivative;
    
    if (Math.abs(newRate - rate) < precision) {
      return newRate;
    }
    
    rate = newRate;
  }
  
  // Failed to converge
  console.warn('IRR calculation did not converge');
  return rate;
};

/**
 * Format a number as currency
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - Value to format (as decimal)
 * @returns {string} - Formatted percentage string
 */
export const formatPercent = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}; 