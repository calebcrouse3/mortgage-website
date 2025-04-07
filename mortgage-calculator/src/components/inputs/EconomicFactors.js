import React from 'react';
import { PercentInput, InputSection, InputGrid } from './InputComponents';

/**
 * Economic Factors inputs component
 * Contains fields for home appreciation, inflation rate, rent increase
 */
const EconomicFactors = () => {
  return (
    <InputSection 
      title="Economy" 
      description="Assumptions about growth rates in the economy and housing market."
    >
      <InputGrid>
        <PercentInput
          label="Home Appreciation"
          field="yrHomeAppreciation"
          min={0}
          max={15}
          step={0.1}
        />
        <PercentInput
          label="Inflation Rate"
          field="yrInflationRate"
          min={0}
          max={15}
          step={0.1}
        />
      </InputGrid>
      
      <InputGrid>
        <PercentInput
          label="Yearly Rent Increase"
          field="yrRentIncrease"
          min={0}
          max={15}
          step={0.1}
        />
      </InputGrid>
    </InputSection>
  );
};

export default EconomicFactors; 