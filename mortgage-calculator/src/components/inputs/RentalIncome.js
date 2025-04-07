import React from 'react';
import { DollarInput, PercentInput, InputSection, InputGrid } from './InputComponents';

/**
 * Rental Income inputs component
 * Contains fields for rental income, vacancy rate, management fees, etc.
 */
const RentalIncome = () => {
  return (
    <InputSection title="Rental Income">
      <InputGrid>
        <DollarInput
          label="Mo. Rental Income"
          field="moRentIncome"
          min={0}
          max={100000}
          step={50}
        />
        <DollarInput
          label="Mo. Misc Income"
          field="moOtherIncome"
          min={0}
          max={10000}
          step={50}
        />
      </InputGrid>
      
      <InputGrid>
        <PercentInput
          label="Vacancy Rate"
          field="vacancyRate"
          min={0}
          max={50}
          step={0.5}
          helperText="Percentage of the year the property is vacant"
        />
        <PercentInput
          label="Management Fee"
          field="managementRate"
          min={0}
          max={30}
          step={0.5}
          helperText="Percentage of rental income paid to property management"
        />
      </InputGrid>
    </InputSection>
  );
};

export default RentalIncome; 