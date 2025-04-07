import React from 'react';
import { PercentInput, InputSection, InputGrid } from './InputComponents';

/**
 * Selling Inputs component
 * Contains fields for income tax, realtor fee, capital gains tax
 */
const SellingInputs = () => {
  return (
    <InputSection title="Selling Fees/Taxes">
      <InputGrid>
        <PercentInput
          label="Income Tax"
          field="incomeTaxRate"
          min={0}
          max={50}
          step={0.5}
          helperText="If rental property cash flows, that profit is taxed at this rate"
        />
        <PercentInput
          label="Realtor Fee"
          field="realtorRate"
          min={0}
          max={10}
          step={0.5}
        />
      </InputGrid>
      
      <InputGrid>
        <PercentInput
          label="Capital Gains Tax"
          field="capitalGainsTaxRate"
          min={0}
          max={50}
          step={0.5}
          helperText="Tax on profits from selling property or stock"
        />
      </InputGrid>
    </InputSection>
  );
};

export default SellingInputs; 