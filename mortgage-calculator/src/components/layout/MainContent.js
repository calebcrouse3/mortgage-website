import React from 'react';
import { Box, Paper, Typography, Alert, Divider } from '@mui/material';
import TabContainer from '../tabs/TabContainer';
import { useAppContext } from '../../context/AppContext';

/**
 * MainContent component
 * Displays the main content area with introduction and visualization tabs
 */
const MainContent = ({ simulationData, loading }) => {
  const { xlim, chartMode } = useAppContext();
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mortgage Payment Analysis Tool
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          This tool provides comprehensive mortgage payment analysis to help you make informed decisions about home purchases, 
          investment properties, and financial planning.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Use the inputs in the sidebar to enter your mortgage details, property expenses, income potential, and economic assumptions. 
          Click "Calculate" to generate visualizations and analyses based on your inputs.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          Start by filling out the Mortgage section with your home price and down payment. Click "Calculate" to see the results.
        </Alert>
      </Paper>
      
      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Calculating...
          </Typography>
        </Paper>
      ) : (
        <TabContainer 
          simulationData={simulationData}
          xlim={xlim}
          chartMode={chartMode}
        />
      )}
    </Box>
  );
};

export default MainContent; 