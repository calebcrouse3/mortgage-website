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
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAppContext } from '../../context/AppContext';

/**
 * Custom label component with tooltip
 */
const LabelWithTooltip = ({ label, helperText }) => {
  if (!helperText) return label;
  
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      {label}
      <Tooltip title={helperText} placement="top">
        <IconButton size="small" sx={{ padding: '2px', ml: 0.5 }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

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
      label={<LabelWithTooltip label={label} helperText={helperText} />}
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
      label={<LabelWithTooltip label={label} helperText={helperText} />}
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
      <InputLabel>{<LabelWithTooltip label={label} helperText={helperText} />}</InputLabel>
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
    </FormControl>
  );
};

/**
 * Input section with title and description
 */
export const InputSection = ({ title, description, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
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