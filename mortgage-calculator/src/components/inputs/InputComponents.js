import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';

/**
 * Currency input field with dollar sign
 */
export const DollarInput = ({ 
  label, 
  field, 
  min = 0, 
  max = 1e8, 
  step = 10,

  helperText = null 
}) => {
  const { updateField } = useAppContext();
  const contextValue = useAppContext()[field];
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    
    // Validate the value is within bounds
    if (value >= min && value <= max) {
      updateField(field, value);
    }
  };
  
  return (
    <TextField
      label={label}
      type="number"
      value={contextValue}
      onChange={handleChange}
      fullWidth
      inputProps={{
        min,
        max,
        step,
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      helperText={helperText}
      margin="normal"
    />
  );
};

/**
 * Percentage input field with percent sign
 */
export const PercentInput = ({ 
  label, 
  field, 
  min = 0.0, 
  max = 99.0, 
  step = 0.1,
  helperText = null 
}) => {
  const { updateField } = useAppContext();
  const contextValue = useAppContext()[field];
  
  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    
    // Validate the value is within bounds
    if (value >= min && value <= max) {
      updateField(field, value);
    }
  };
  
  return (
    <TextField
      label={label}
      type="number"
      value={contextValue}
      onChange={handleChange}
      fullWidth
      inputProps={{
        min,
        max,
        step,
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      helperText={helperText}
      margin="normal"
    />
  );
};

/**
 * Dropdown select input for investment options
 */
export const SelectInput = ({ 
  label, 
  field, 
  options, 
  helperText = null 
}) => {
  const { updateField } = useAppContext();
  const contextValue = useAppContext()[field];
  
  const handleChange = (e) => {
    updateField(field, e.target.value);
  };
  
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        value={contextValue}
        onChange={handleChange}
        label={label}
      >
        {Object.keys(options).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

/**
 * Input section with title and description
 */
export const InputSection = ({ title, description, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
};

/**
 * Two column layout for inputs
 */
export const InputGrid = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}; 