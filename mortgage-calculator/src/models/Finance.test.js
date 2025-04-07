import {
  getAmortizationPayment,
  getTotalInterestPaid,
  addGrowth,
  cancelPmiFromEquity,
  cancelPmiFromLoanBalance,
  getMonthlyPmi,
  calculateIRR,
  formatCurrency,
  formatPercent
} from './Finance';

describe('Finance utility functions', () => {
  describe('getAmortizationPayment', () => {
    test('calculates 30-year mortgage payment correctly', () => {
      // $300,000 loan at 6% interest for 30 years
      const result = getAmortizationPayment(300000, 0.06, 30);
      expect(result).toBeCloseTo(1798.65, 2);
    });

    test('calculates 15-year mortgage payment correctly', () => {
      // $200,000 loan at 4.5% interest for 15 years
      const result = getAmortizationPayment(200000, 0.045, 15);
      expect(result).toBeCloseTo(1530.40, 2);
    });

    test('calculates zero when loan amount is zero', () => {
      const result = getAmortizationPayment(0, 0.05, 30);
      expect(result).toBe(0);
    });
  });

  describe('getTotalInterestPaid', () => {
    test('calculates total interest for 30-year mortgage correctly', () => {
      // $300,000 loan at 6% interest for 30 years
      const result = getTotalInterestPaid(300000, 0.06, 30);
      expect(result).toBeCloseTo(347514, 0);
    });

    test('calculates total interest for 15-year mortgage correctly', () => {
      // $200,000 loan at 4.5% interest for 15 years
      const result = getTotalInterestPaid(200000, 0.045, 15);
      expect(result).toBeCloseTo(75472, 0);
    });
  });

  describe('addGrowth', () => {
    test('adds growth without monthly contribution', () => {
      // $100,000 with 5% annual growth for 12 months (1 year)
      const result = addGrowth(100000, 0.05, 12);
      expect(result).toBeCloseTo(105000, 0);
    });

    test('adds growth with monthly contribution', () => {
      // $100,000 with 5% annual growth for 12 months with $1,000 monthly contribution
      const result = addGrowth(100000, 0.05, 12, 1000);
      expect(result).toBeCloseTo(117184.29, 2);
    });

    test('handles zero initial value with contributions', () => {
      // $0 with 7% annual growth for 24 months with $500 monthly contribution
      const result = addGrowth(0, 0.07, 24, 500);
      expect(result).toBeCloseTo(12761.62, 2);
    });
  });

  describe('PMI functions', () => {
    test('cancelPmiFromEquity returns true when equity >= 20%', () => {
      expect(cancelPmiFromEquity(500000, 400000)).toBe(false);
      expect(cancelPmiFromEquity(500000, 390000)).toBe(true);
    });

    test('cancelPmiFromLoanBalance returns true when loan balance <= 80% of initial value', () => {
      expect(cancelPmiFromLoanBalance(400000, 330000)).toBe(false);
      expect(cancelPmiFromLoanBalance(400000, 320000)).toBe(true);
    });

    test('getMonthlyPmi returns correct PMI amount when required', () => {
      // PMI rate of 0.5%, home value $400k, loan balance $350k, initial value $400k
      const result = getMonthlyPmi(400000, 350000, 0.005, 400000);
      expect(result).toBeCloseTo(145.83, 2); // (350000 * 0.005) / 12
    });

    test('getMonthlyPmi returns 0 when PMI should be cancelled', () => {
      // PMI rate of 0.5%, home value $500k, loan balance $390k (just at 78% LTV), initial value $500k
      const result = getMonthlyPmi(500000, 390000, 0.005, 500000);
      expect(result).toBe(0);
    });
  });

  describe('calculateIRR', () => {
    test('calculates IRR correctly for simple cash flows', () => {
      // Investment of -1000, then returns of 500, 500, 500
      const cashflows = [-1000, 500, 500, 500];
      const result = calculateIRR(cashflows);
      expect(result).toBeCloseTo(0.1722, 4);
    });

    test('handles negative IRR scenario', () => {
      // Investment of -1000, then returns of 300, 300, 300
      const cashflows = [-1000, 300, 300, 300];
      const result = calculateIRR(cashflows);
      expect(result).toBeLessThan(0);
    });
  });

  describe('formatting functions', () => {
    test('formatCurrency formats numbers as USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235');
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(-500)).toBe('-$500');
    });

    test('formatPercent formats decimal as percentage', () => {
      expect(formatPercent(0.0535)).toBe('5.4%');
      expect(formatPercent(1)).toBe('100.0%');
      expect(formatPercent(0)).toBe('0.0%');
    });
  });
}); 