import React from 'react';
import { DollarInput, PercentInput, InputSection, InputGrid } from './InputComponents';

/**
 * Mortgage inputs component
 * Contains fields for home price, rehab, down payment, interest rate, etc.
 */
const MortgageInputs = () => {
  return (
    <InputSection title="Mortgage">
      <InputGrid>
        <DollarInput
          label="Home Price"
          field="homePrice"
          min={20000}
          max={10000000}
          step={20000}
        />
        <DollarInput
          label="Rehab"
          field="rehab"
          min={0}
          max={500000}
          step={2000}
          helperText="Cost of repairs or renovations right after buying"
        />
      </InputGrid>
      
      <InputGrid>
        <DollarInput
          label="Down Payment"
          field="downPayment"
          min={0}
          max={1000000}
          step={5000}
        />
        <PercentInput
          label="Interest Rate"
          field="interestRate"
          min={0}
          max={20}
          step={0.1}
        />
      </InputGrid>
      
      <InputGrid>
        <PercentInput
          label="Closing Costs"
          field="closingCostsRate"
          min={0}
          max={10}
          step={0.1}
          helperText="Calculated as a percentage of home price"
        />
        <PercentInput
          label="PMI Rate"
          field="pmiRate"
          min={0}
          max={5}
          step={0.1}
          helperText="If down payment is less than 20% of home price, you'll have to pay PMI"
        />
      </InputGrid>
    </InputSection>
  );
};

export default MortgageInputs; 