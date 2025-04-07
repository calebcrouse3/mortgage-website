import { getAmortizationPayment, getMonthlyPmi, addGrowth } from './Finance';

/**
 * Mortgage Calculator simulation class
 * Handles all calculation logic and data processing
 */
export class MortgageCalculator {
  constructor(state) {
    this.state = state;
    this.rates = state.rates;
  }

  /**
   * Get loan amount based on home price, rehab costs, and down payment
   * @returns {number} - Loan amount
   */
  getLoanAmount() {
    return this.state.homePrice + this.state.rehab - this.state.downPayment;
  }

  /**
   * Get out of pocket costs (down payment + closing costs + rehab)
   * @returns {number} - Out of pocket costs
   */
  getOutOfPocketCosts() {
    const closingCosts = this.state.homePrice * this.rates.closingCostsRate;
    return this.state.downPayment + closingCosts + this.state.rehab;
  }

  /**
   * Run monthly simulation
   * @param {boolean} extraPayments - Whether to include extra payments in simulation
   * @returns {Array} - Array of monthly data
   */
  runMonthlySimulation(extraPayments = false) {
    const loanAmount = this.getLoanAmount();
    const oop = this.getOutOfPocketCosts();
    const monthlyPayment = getAmortizationPayment(loanAmount, this.rates.interestRate);
    
    // Initialize monthly updated values
    let pmiExp = getMonthlyPmi(
      this.state.homePrice,
      loanAmount,
      this.rates.pmiRate,
      this.state.homePrice
    );
    let propertyTaxExp = this.state.homePrice * this.rates.yrPropertyTaxRate / 12;
    let insuranceExp = this.state.homePrice * this.rates.yrInsuranceRate / 12;
    let maintenanceExp = this.state.homePrice * this.rates.yrMaintenance / 12;
    let hoaExp = this.state.moHoaFees;
    let utilityExp = this.state.moUtility;
    let rentIncome = this.state.moRentIncome;
    let otherIncome = this.state.moOtherIncome;
    let managementExp = this.rates.managementRate * rentIncome;
    let rentExp = this.state.rentExp;
    
    // Initialize values that are updated monthly
    let loanBalance = loanAmount;
    let homeValue = this.state.homePrice;
    let pmiRequired = pmiExp > 0;
    
    // Portfolio comparisons
    let rentComparisonPortfolio = oop; // portfolio funded with money saved from renting
    let extraPaymentsPortfolio = 0; // portfolio funded with extra payments
    
    const monthlyData = [];
    
    for (let month = 0; month < 12 * 30; month++) {
      // Calculate principal and interest
      const interestExp = loanBalance * this.rates.interestRate / 12;
      let principalExp = monthlyPayment - interestExp;
      let extraPaymentExp = 0;
      
      // Handle extra payments
      if (extraPayments) {
        if (principalExp >= loanBalance) {
          principalExp = loanBalance;
        } else if (month < this.state.numExtraPayments) {
          extraPaymentExp = Math.min(loanBalance - principalExp, this.state.moExtraPayment);
        }
      }
      
      // Update loan balance
      loanBalance -= principalExp;
      loanBalance -= extraPaymentExp;
      
      // Cancel PMI if appropriate
      if (!pmiRequired) {
        pmiExp = 0;
      }
      
      // Calculate expenses
      const opExp = propertyTaxExp + insuranceExp + hoaExp + maintenanceExp + 
                   pmiExp + utilityExp + managementExp;
      
      const totalExp = opExp + interestExp + principalExp + extraPaymentExp;
      const totalIncome = rentIncome + otherIncome;
      const adjTotalIncome = totalIncome * (1 - this.rates.vacancyRate);
      let noi = adjTotalIncome - opExp;
      let niaf = adjTotalIncome - totalExp;
      
      // Apply income tax to profits
      if (niaf > 0) {
        niaf *= (1 - this.rates.incomeTaxRate);
      }
      
      // Update PMI requirement
      const pmiTrue = getMonthlyPmi(
        homeValue,
        loanBalance,
        this.rates.pmiRate,
        this.state.homePrice
      );
      pmiRequired = pmiTrue > 0;
      
      // Update portfolios
      if (totalExp > rentExp) {
        rentComparisonPortfolio += (totalExp - rentExp);
      }
      
      // Update for extra payments portfolio
      if (extraPayments && extraPaymentExp > 0) {
        extraPaymentsPortfolio = addGrowth(
          extraPaymentsPortfolio,
          this.rates.extraPaymentsPortfolioGrowth,
          1,
          extraPaymentExp
        );
      }
      
      // Apply rent growth every 12 months
      if (month > 0 && month % 12 === 0) {
        rentExp *= (1 + this.rates.yrRentIncrease);
        rentIncome *= (1 + this.rates.yrRentIncrease);
        otherIncome *= (1 + this.rates.yrRentIncrease);
        managementExp = this.rates.managementRate * rentIncome;
      }
      
      // Apply home appreciation
      homeValue = addGrowth(homeValue, this.rates.yrHomeAppreciation, 1);
      
      // Record data for this month
      monthlyData.push({
        month,
        loanBalance,
        homeValue,
        interestExp,
        principalExp,
        extraPaymentExp,
        propertyTaxExp,
        insuranceExp,
        hoaExp,
        maintenanceExp,
        pmiExp,
        utilityExp,
        managementExp,
        opExp,
        totalExp,
        rentIncome,
        otherIncome,
        adjTotalIncome,
        noi,
        niaf,
        rentExp,
        rentComparisonPortfolio,
        extraPaymentsPortfolio
      });
      
      // Check if loan is paid off
      if (loanBalance <= 0) {
        break;
      }
    }
    
    return monthlyData;
  }

  /**
   * Aggregate monthly data to yearly data
   * @param {Array} monthlyData - Array of monthly data
   * @returns {Array} - Array of yearly data
   */
  getYearlyData(monthlyData) {
    const yearlyData = [];
    const oop = this.getOutOfPocketCosts();
    const closingCosts = this.state.homePrice * this.rates.closingCostsRate;
    
    for (let year = 0; year < 30; year++) {
      const startIdx = year * 12;
      const endIdx = startIdx + 11;
      
      // Check if data exists for this year
      if (startIdx >= monthlyData.length) {
        break;
      }
      
      const yearMonths = monthlyData.slice(startIdx, Math.min(endIdx + 1, monthlyData.length));
      if (yearMonths.length === 0) break;
      
      // Sum up monthly values
      const yearData = {
        year,
        // Get the final values for these from the last month of the year
        loanBalance: yearMonths[yearMonths.length - 1].loanBalance,
        homeValue: yearMonths[yearMonths.length - 1].homeValue,
        rentComparisonPortfolio: yearMonths[yearMonths.length - 1].rentComparisonPortfolio,
        extraPaymentsPortfolio: yearMonths[yearMonths.length - 1].extraPaymentsPortfolio,
        
        // Sum up expenses for the year
        interestExp: yearMonths.reduce((sum, m) => sum + m.interestExp, 0),
        principalExp: yearMonths.reduce((sum, m) => sum + m.principalExp, 0),
        extraPaymentExp: yearMonths.reduce((sum, m) => sum + m.extraPaymentExp, 0),
        propertyTaxExp: yearMonths.reduce((sum, m) => sum + m.propertyTaxExp, 0),
        insuranceExp: yearMonths.reduce((sum, m) => sum + m.insuranceExp, 0),
        hoaExp: yearMonths.reduce((sum, m) => sum + m.hoaExp, 0),
        maintenanceExp: yearMonths.reduce((sum, m) => sum + m.maintenanceExp, 0),
        pmiExp: yearMonths.reduce((sum, m) => sum + m.pmiExp, 0),
        utilityExp: yearMonths.reduce((sum, m) => sum + m.utilityExp, 0),
        managementExp: yearMonths.reduce((sum, m) => sum + m.managementExp, 0),
        opExp: yearMonths.reduce((sum, m) => sum + m.opExp, 0),
        totalExp: yearMonths.reduce((sum, m) => sum + m.totalExp, 0),
        
        // Income data
        rentIncome: yearMonths.reduce((sum, m) => sum + m.rentIncome, 0),
        otherIncome: yearMonths.reduce((sum, m) => sum + m.otherIncome, 0),
        adjTotalIncome: yearMonths.reduce((sum, m) => sum + m.adjTotalIncome, 0),
        noi: yearMonths.reduce((sum, m) => sum + m.noi, 0),
        niaf: yearMonths.reduce((sum, m) => sum + m.niaf, 0),
        
        // Rent comparison
        rentExp: yearMonths.reduce((sum, m) => sum + m.rentExp, 0),
        
        // Calculate monthly averages
        interestExp_mo: yearMonths.reduce((sum, m) => sum + m.interestExp, 0) / yearMonths.length,
        principalExp_mo: yearMonths.reduce((sum, m) => sum + m.principalExp, 0) / yearMonths.length,
        extraPaymentExp_mo: yearMonths.reduce((sum, m) => sum + m.extraPaymentExp, 0) / yearMonths.length,
        propertyTaxExp_mo: yearMonths.reduce((sum, m) => sum + m.propertyTaxExp, 0) / yearMonths.length,
        insuranceExp_mo: yearMonths.reduce((sum, m) => sum + m.insuranceExp, 0) / yearMonths.length,
        hoaExp_mo: yearMonths.reduce((sum, m) => sum + m.hoaExp, 0) / yearMonths.length,
        maintenanceExp_mo: yearMonths.reduce((sum, m) => sum + m.maintenanceExp, 0) / yearMonths.length,
        pmiExp_mo: yearMonths.reduce((sum, m) => sum + m.pmiExp, 0) / yearMonths.length,
        utilityExp_mo: yearMonths.reduce((sum, m) => sum + m.utilityExp, 0) / yearMonths.length,
        managementExp_mo: yearMonths.reduce((sum, m) => sum + m.managementExp, 0) / yearMonths.length,
        opExp_mo: yearMonths.reduce((sum, m) => sum + m.opExp, 0) / yearMonths.length,
        totalExp_mo: yearMonths.reduce((sum, m) => sum + m.totalExp, 0) / yearMonths.length,
        rentIncome_mo: yearMonths.reduce((sum, m) => sum + m.rentIncome, 0) / yearMonths.length,
        otherIncome_mo: yearMonths.reduce((sum, m) => sum + m.otherIncome, 0) / yearMonths.length,
        adjTotalIncome_mo: yearMonths.reduce((sum, m) => sum + m.adjTotalIncome, 0) / yearMonths.length,
        noi_mo: yearMonths.reduce((sum, m) => sum + m.noi, 0) / yearMonths.length,
        niaf_mo: yearMonths.reduce((sum, m) => sum + m.niaf, 0) / yearMonths.length,
        rentExp_mo: yearMonths.reduce((sum, m) => sum + m.rentExp, 0) / yearMonths.length,
      };
      
      // Add real estate metrics
      const equity = yearData.homeValue - yearData.loanBalance;
      const equityRatio = equity / yearData.homeValue;
      const afterTaxSaleProceeds = equity - (yearData.homeValue - this.state.homePrice) * this.rates.capitalGainsTaxRate;
      const realtorFee = yearData.homeValue * this.rates.realtorRate;
      const saleProceeds = afterTaxSaleProceeds - realtorFee;
      
      // Return metrics
      yearData.coc_roi = yearData.niaf / oop;
      yearData.total_return = saleProceeds - oop;
      yearData.net_worth = equity + yearData.niaf;
      yearData.roi = yearData.total_return / oop;
      yearData.annualized_roi = Math.pow(1 + yearData.roi, 1 / (year + 1)) - 1;
      
      // Rent vs. buy metrics
      yearData.rent_vs_own_savings = yearData.total_return - 
        (yearData.rentComparisonPortfolio - oop);
      
      yearlyData.push(yearData);
    }
    
    return yearlyData;
  }
  
  /**
   * Run the full simulation and return data
   * @param {boolean} extraPayments - Whether to include extra payments
   * @returns {Object} - Object containing monthly and yearly data
   */
  runSimulation(extraPayments = false) {
    const monthlyData = this.runMonthlySimulation(extraPayments);
    const yearlyData = this.getYearlyData(monthlyData);
    
    return {
      monthlyData,
      yearlyData
    };
  }
} 