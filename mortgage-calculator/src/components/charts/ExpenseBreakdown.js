import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper, Typography } from '@mui/material';
import { formatCurrency } from '../../models/Finance';

// Color mapping for different expense types
const COLOR_MAP = {
  "interestExp_mo": "#0068C9",  // Blue
  "principalExp_mo": "#83C9FF",  // Light Blue
  "propertyTaxExp_mo": "#FF2A2B",  // Red
  "insuranceExp_mo": "#FFABAB",  // Light Red
  "hoaExp_mo": "#2AB09D",  // Light Green
  "maintenanceExp_mo": "#7EEFA1",  // Green
  "utilityExp_mo": "#FF8700",  // Orange
  "managementExp_mo": "#FFD16A",  // Light Orange
  "pmiExp_mo": "#9030A1",  // Purple
};

// Format label for display
const formatLabel = (label) => {
  const output = label.replace('_mo', '').replace('Exp', '');
  return output
    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

/**
 * ExpenseBreakdown component
 * Displays a pie chart of monthly expenses
 */
const ExpenseBreakdown = ({ yearlyData }) => {
  if (!yearlyData || yearlyData.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available. Click "Calculate" to generate chart.
        </Typography>
      </Paper>
    );
  }
  
  // Get first year data for initial expenses
  const firstYearData = yearlyData[0];
  
  // Prepare pie chart data
  const expenseData = [];
  const expenseColors = [];
  const labels = [];
  const values = [];
  
  Object.keys(COLOR_MAP).forEach(key => {
    if (firstYearData[key] && firstYearData[key] > 0) {
      const value = firstYearData[key];
      
      labels.push(formatLabel(key));
      values.push(value);
      expenseColors.push(COLOR_MAP[key]);
      expenseData.push({
        name: formatLabel(key),
        value: value,
        formatted: formatCurrency(value)
      });
    }
  });
  
  // Total monthly expenses
  const totalMonthly = values.reduce((sum, val) => sum + val, 0);
  
  // Data for the pie chart
  const data = [{
    values: values,
    labels: labels,
    type: 'pie',
    hole: 0.6,
    marker: {
      colors: expenseColors,
      line: {
        color: '#000000',
        width: 2
      }
    },
    textinfo: 'label+value',
    texttemplate: '%{label}<br>$%{value:.0f}',
    hoverinfo: 'label+percent',
    textposition: 'outside',
    sort: false,
  }];
  
  // Layout for the pie chart
  const layout = {
    title: 'Monthly Expenses in First Year',
    annotations: [{
      font: {
        size: 20
      },
      showarrow: false,
      text: `Total:<br>${formatCurrency(totalMonthly)}`,
      x: 0.5,
      y: 0.5
    }],
    height: 500,
    width: "100%",
    autosize: true,
    margin: { l: 20, r: 20, t: 50, b: 20 },
    showlegend: false,
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Expense Breakdown
      </Typography>
      
      <Box>
        <Plot
          data={data}
          layout={layout}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Paper>
  );
};

export default ExpenseBreakdown; 