import React from 'react';
import { DollarInput, PercentInput, InputSection, InputGrid } from './InputComponents';

/**
 * Expense inputs component
 * Contains fields for property tax, insurance, HOA, utilities, etc.
 */
const ExpenseInputs = () => {
  return (
    <InputSection title="Expenses">
      <InputGrid>
        <PercentInput
          label="Property Tax"
          field="yrPropertyTaxRate"
          min={0}
          max={5}
          step={0.1}
        />
        <PercentInput
          label="Insurance Rate"
          field="yrInsuranceRate"
          min={0}
          max={2}
          step={0.05}
          helperText="Yearly insurance as a percentage of home value"
        />
      </InputGrid>
      
      <InputGrid>
        <DollarInput
          label="Monthly HOA Fees"
          field="moHoaFees"
          min={0}
          max={10000}
          step={50}
        />
        <DollarInput
          label="Monthly Utilities"
          field="moUtility"
          min={0}
          max={10000}
          step={50}
        />
      </InputGrid>
      
      <InputGrid>
        <PercentInput
          label="Maintenance"
          field="yrMaintenance"
          min={0}
          max={5}
          step={0.1}
          helperText="Yearly maintenance as a percentage of home value"
        />
      </InputGrid>
    </InputSection>
  );
};

export default ExpenseInputs; 