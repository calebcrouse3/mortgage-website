import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import AmortizationChart from '../charts/AmortizationChart';
import ExpenseBreakdown from '../charts/ExpenseBreakdown';
import HomeValue from '../charts/HomeValue';

// TabPanel component to handle tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mortgage-tabpanel-${index}`}
      aria-labelledby={`mortgage-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * TabContainer component
 * Manages navigation between different visualization tabs
 */
const TabContainer = ({ simulationData, xlim, chartMode }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get data from simulation results
  const { yearlyData = [] } = simulationData || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: '50px',
              fontWeight: 'bold',
            }
          }}
        >
          <Tab label="Loan Amortization" />
          <Tab label="Monthly Expenses" />
          <Tab label="Home Value" />
          <Tab label="Rent vs. Buy" disabled={!simulationData} />
          <Tab label="Return on Investment" disabled={!simulationData} />
          <Tab label="Cash Flow" disabled={!simulationData} />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <AmortizationChart 
          yearlyData={yearlyData} 
          xlim={xlim} 
          chartMode={chartMode} 
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ExpenseBreakdown 
          yearlyData={yearlyData} 
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <HomeValue 
          yearlyData={yearlyData} 
          xlim={xlim} 
          chartMode={chartMode} 
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          Rent vs. Buy Analysis
          <Box sx={{ mt: 2, color: 'text.secondary' }}>
            This feature will be implemented in the next phase.
          </Box>
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          Return on Investment Analysis
          <Box sx={{ mt: 2, color: 'text.secondary' }}>
            This feature will be implemented in the next phase.
          </Box>
        </Paper>
      </TabPanel>
      
      <TabPanel value={tabValue} index={5}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          Cash Flow Analysis
          <Box sx={{ mt: 2, color: 'text.secondary' }}>
            This feature will be implemented in the next phase.
          </Box>
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default TabContainer; 