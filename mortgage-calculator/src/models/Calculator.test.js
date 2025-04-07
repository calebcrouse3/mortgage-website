import { MortgageCalculator } from './Calculator';

describe('MortgageCalculator', () => {
  // Mock default state for tests
  const mockState = {
    homePrice: 300000,
    rehab: 10000,
    downPayment: 60000,
    moRentIncome: 2000,
    moOtherIncome: 100,
    moUtility: 150,
    moHoaFees: 50, 
    rentExp: 1500,
    moExtraPayment: 200,
    numExtraPayments: 60,
    rates: {
      closingCostsRate: 0.03,
      interestRate: 0.06,
      pmiRate: 0.005,
      yrPropertyTaxRate: 0.01,
      yrHomeAppreciation: 0.03,
      yrInsuranceRate: 0.004,
      yrMaintenance: 0.01,
      managementRate: 0.10,
      vacancyRate: 0.05,
      incomeTaxRate: 0.25,
      extraPaymentsPortfolioGrowth: 0.07
    }
  };

  describe('getLoanAmount', () => {
    test('calculates loan amount correctly', () => {
      const calculator = new MortgageCalculator(mockState);
      // homePrice + rehab - downPayment = 300000 + 10000 - 60000 = 250000
      expect(calculator.getLoanAmount()).toBe(250000);
    });

    test('handles zero values', () => {
      const zeroState = {
        ...mockState,
        homePrice: 0,
        rehab: 0,
        downPayment: 0
      };
      const calculator = new MortgageCalculator(zeroState);
      expect(calculator.getLoanAmount()).toBe(0);
    });
  });

  describe('getOutOfPocketCosts', () => {
    test('calculates out of pocket costs correctly', () => {
      const calculator = new MortgageCalculator(mockState);
      // downPayment + (homePrice * closingCostsRate) + rehab
      // = 60000 + (300000 * 0.03) + 10000 = 79000
      expect(calculator.getOutOfPocketCosts()).toBe(79000);
    });
  });

  describe('runMonthlySimulation', () => {
    test('generates correct monthly data for the first month', () => {
      const calculator = new MortgageCalculator(mockState);
      const monthlyData = calculator.runMonthlySimulation();
      
      // Check that we have data for 30 years × 12 months = 360 months (or less if loan paid early)
      expect(monthlyData.length).toBeLessThanOrEqual(360);
      expect(monthlyData.length).toBeGreaterThan(250); // Loan should last at least 20 years
      
      // Check first month data
      const firstMonth = monthlyData[0];
      
      // Loan balance should be initial loan amount minus first principal payment
      expect(firstMonth.loanBalance).toBeLessThan(250000);
      
      // Check that home value is the initial value
      expect(firstMonth.homeValue).toBeCloseTo(300000);
      
      // Check monthly payment components
      expect(firstMonth.interestExp).toBeCloseTo(1250, 0); // First month interest: 250000 * 0.06 / 12
      
      // Monthly principal + interest payment should be close to mortgage payment formula result
      const monthlyPayment = 1498.88; // Approx for $250k, 6%, 30yr
      expect(firstMonth.principalExp + firstMonth.interestExp).toBeCloseTo(monthlyPayment, 0);
      
      // PMI should be (loanAmount * pmiRate) / 12 if LTV > 80%
      expect(firstMonth.pmiExp).toBeCloseTo(104.17, 2); // (250000 * 0.005) / 12
      
      // Property tax should be (homePrice * yrPropertyTaxRate) / 12
      expect(firstMonth.propertyTaxExp).toBeCloseTo(250, 0); // (300000 * 0.01) / 12
      
      // Insurance should be (homePrice * yrInsuranceRate) / 12
      expect(firstMonth.insuranceExp).toBeCloseTo(100, 0); // (300000 * 0.004) / 12
      
      // Maintenance should be (homePrice * yrMaintenance) / 12
      expect(firstMonth.maintenanceExp).toBeCloseTo(250, 0); // (300000 * 0.01) / 12
      
      // Check that rental income values are correct
      expect(firstMonth.rentIncome).toBe(2000);
      expect(firstMonth.otherIncome).toBe(100);
      
      // Management fee should be rentIncome * managementRate
      expect(firstMonth.managementExp).toBeCloseTo(200, 0); // 2000 * 0.10
      
      // Adjusted income should account for vacancy rate
      expect(firstMonth.adjTotalIncome).toBeCloseTo(2000 + 100 - ((2000 + 100) * 0.05), 2);
    });

    test('simulates extra payments correctly', () => {
      const calculator = new MortgageCalculator(mockState);
      const monthlyData = calculator.runMonthlySimulation(true);
      
      // With extra payments, loan should be paid off faster
      expect(monthlyData.length).toBeLessThan(360);
      
      // First month should include extra payment
      const firstMonth = monthlyData[0];
      expect(firstMonth.extraPaymentExp).toBe(200);
      
      // Month 61 should have no extra payment (numExtraPayments is 60)
      if (monthlyData.length > 61) {
        const month61 = monthlyData[60];
        expect(month61.extraPaymentExp).toBe(0);
      }
      
      // Extra payments portfolio should grow over time
      const lastMonth = monthlyData[monthlyData.length - 1];
      expect(lastMonth.extraPaymentsPortfolio).toBeGreaterThan(12000); // 60 payments * $200 minimum
    });

    test('applies home appreciation correctly', () => {
      const calculator = new MortgageCalculator(mockState);
      const monthlyData = calculator.runMonthlySimulation();
      
      // Check that home value increases over time
      const firstMonth = monthlyData[0];
      const lastMonth = monthlyData[monthlyData.length - 1];
      
      expect(lastMonth.homeValue).toBeGreaterThan(firstMonth.homeValue);
      
      // After 12 months, home value should increase by yearly appreciation rate
      const month12 = monthlyData[11];
      expect(month12.homeValue).toBeCloseTo(300000 * 1.03, 0);
    });

    test('cancels PMI at appropriate LTV', () => {
      const calculator = new MortgageCalculator(mockState);
      const monthlyData = calculator.runMonthlySimulation();
      
      // Find the month when PMI is cancelled
      let pmiCancelMonth = -1;
      for (let i = 0; i < monthlyData.length; i++) {
        if (i > 0 && monthlyData[i-1].pmiExp > 0 && monthlyData[i].pmiExp === 0) {
          pmiCancelMonth = i;
          break;
        }
      }
      
      // PMI should be cancelled at some point
      expect(pmiCancelMonth).toBeGreaterThan(0);
      
      // Check that the LTV ratio at cancellation is appropriate (either via equity or loan balance)
      const cancelMonth = monthlyData[pmiCancelMonth];
      
      // Either equity is >= 20% of home value OR loan balance <= 80% of initial home value
      const ltvOk = 
        cancelMonth.loanBalance <= 0.8 * 300000 || 
        cancelMonth.loanBalance <= 0.8 * cancelMonth.homeValue;
        
      expect(ltvOk).toBe(true);
    });
  });

  describe('getYearlyData', () => {
    test('aggregates monthly data correctly', () => {
      const calculator = new MortgageCalculator(mockState);
      const monthlyData = calculator.runMonthlySimulation();
      const yearlyData = calculator.getYearlyData(monthlyData);
      
      // Should have fewer years than months
      expect(yearlyData.length).toBeLessThanOrEqual(Math.ceil(monthlyData.length / 12));
      
      // Check first year aggregation
      const firstYear = yearlyData[0];
      
      // Yearly values should be approximately 12 times monthly values for the first year
      expect(firstYear.rentIncome).toBeCloseTo(2000 * 12, 0);
      expect(firstYear.otherIncome).toBeCloseTo(100 * 12, 0);
      
      // Sum of interest for the year should match sum of first 12 months
      const firstYearInterestSum = monthlyData.slice(0, 12).reduce((sum, m) => sum + m.interestExp, 0);
      expect(firstYear.interestExp).toBeCloseTo(firstYearInterestSum, 0);
      
      // Sum of principal for the year should match sum of first 12 months
      const firstYearPrincipalSum = monthlyData.slice(0, 12).reduce((sum, m) => sum + m.principalExp, 0);
      expect(firstYear.principalExp).toBeCloseTo(firstYearPrincipalSum, 0);
      
      // Monthly averages should be yearly values divided by 12
      expect(firstYear.rentIncome_mo).toBeCloseTo(firstYear.rentIncome / 12, 2);
      expect(firstYear.interestExp_mo).toBeCloseTo(firstYear.interestExp / 12, 2);
    });
  });
}); 