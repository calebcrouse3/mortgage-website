import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * MetricBox component
 * Reusable component for displaying metric values with consistent styling
 * 
 * @param {string} label - The label text for the metric
 * @param {string|number} value - The primary value to display
 * @param {string} [subtext] - Optional secondary text (like percentage or additional context)
 * @param {string} [subtextColor] - Optional color for the subtext (e.g., 'primary', 'success.main')
 * @param {object} [sx] - Optional additional styling to apply to the box
 */
const MetricBox = ({ label, value, subtext, subtextColor = 'primary', sx = {} }) => {
  return (
    <Box 
      sx={{ 
        p: 1, 
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight="medium" lineHeight={1.2}>
        {value}
      </Typography>
      {subtext && (
        <Typography variant="caption" color={subtextColor} lineHeight={1.2}>
          {subtext}
        </Typography>
      )}
    </Box>
  );
};

export default MetricBox; 