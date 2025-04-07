import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  InputAdornment
} from '@mui/material';
import { InputSection, InputGrid } from './InputComponents';
import { useAppContext } from '../../context/AppContext';

/**
 * Chart Options component
 * Contains fields for chart display options
 */
const ChartOptions = () => {
  const { xlim, chartMode, updateField } = useAppContext();
  
  const handleXlimChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 5 && value <= 30) {
      updateField('xlim', value);
    }
  };
  
  const handleChartModeChange = (e) => {
    updateField('chartMode', e.target.value);
  };
  
  return (
    <InputSection title="Chart Options">
      <InputGrid>
        <TextField
          label="X-axis Max"
          type="number"
          value={xlim}
          onChange={handleXlimChange}
          fullWidth
          inputProps={{
            min: 5,
            max: 30,
            step: 5,
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">Years</InputAdornment>,
          }}
          margin="normal"
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Chart Mode</InputLabel>
          <Select
            value={chartMode}
            onChange={handleChartModeChange}
            label="Chart Mode"
          >
            <MenuItem value="Lines">Lines</MenuItem>
            <MenuItem value="Dots">Dots</MenuItem>
          </Select>
        </FormControl>
      </InputGrid>
    </InputSection>
  );
};

export default ChartOptions; 