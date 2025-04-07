import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper, Typography } from '@mui/material';
import { formatCurrency } from '../../models/Finance';
import MetricBox from './MetricBox';

// Constants for chart styling
const BLUE = "#1f77b4";
const ORANGE = "#ff7f0e";
const GREEN = "#2ca02c";
const RED = "#d62728";

const PLOT_COLORS = [BLUE, ORANGE, GREEN, RED];

/**
 * HomeValue component
 * Displays home value growth and equity over time
 */
const HomeValue = ({ yearlyData, xlim, chartMode }) => {
  if (!yearlyData || yearlyData.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data available. Click "Calculate" to generate chart.
        </Typography>
      </Paper>
    );
  }

  // Prepare data for plotting
  const years = yearlyData.map((d) => d.year + 1);
  const homeValues = yearlyData.map((d) => d.homeValue);
  const loanBalances = yearlyData.map((d) => d.loanBalance);
  const equityValues = yearlyData.map((d) => d.homeValue - d.loanBalance);
  
  // Calculate equity percentage
  const equityPercentages = yearlyData.map((d) => {
    const equity = d.homeValue - d.loanBalance;
    return (equity / d.homeValue) * 100;
  });

  // Configure traces based on chart mode
  const mode = chartMode === 'Lines' ? 'lines' : 'markers';
  const lineWidth = chartMode === 'Lines' ? 4 : 0;
  const markerSize = chartMode === 'Dots' ? 10 : 0;

  // Create the traces for plotting
  const traces = [
    {
      x: years,
      y: homeValues,
      name: 'Home Value',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[0] },
      marker: { size: markerSize, color: PLOT_COLORS[0] },
      hovertemplate: '$%{y:,.0f}<extra>Home Value</extra>',
    },
    {
      x: years,
      y: loanBalances,
      name: 'Loan Balance',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[1] },
      marker: { size: markerSize, color: PLOT_COLORS[1] },
      hovertemplate: '$%{y:,.0f}<extra>Loan Balance</extra>',
    },
    {
      x: years,
      y: equityValues,
      name: 'Equity',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[2] },
      marker: { size: markerSize, color: PLOT_COLORS[2] },
      hovertemplate: '$%{y:,.0f}<extra>Equity</extra>',
    },
  ];

  // Layout configuration for the value chart
  const valueLayout = {
    title: 'Home Value & Equity Over Time',
    xaxis: {
      title: 'Year',
      range: [0, xlim + 1],
    },
    yaxis: {
      title: 'Amount ($)',
      tickformat: '$,.0f',
    },
    hovermode: 'x',
    height: 500,
    width: "100%",
    autosize: true,
    margin: { l: 60, r: 30, t: 50, b: 50 },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1
    },
  };

  // Get values for the most recent year (for summary)
  const latestData = yearlyData[Math.min(xlim - 1, yearlyData.length - 1)];
  const initialHomeValue = yearlyData[0].homeValue;
  const latestHomeValue = latestData.homeValue;
  const latestLoanBalance = latestData.loanBalance;
  const latestEquity = latestHomeValue - latestLoanBalance;
  const latestEquityPercentage = (latestEquity / latestHomeValue) * 100;
  const valueGrowth = latestHomeValue - initialHomeValue;
  const valueGrowthPercentage = (valueGrowth / initialHomeValue) * 100;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Home Value Projection
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Plot
            data={traces}
            layout={valueLayout}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '250px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Projected Values at Year {Math.min(xlim, yearlyData.length)}
          </Typography>
          
          <MetricBox 
            label="Home Value" 
            value={formatCurrency(latestHomeValue)}
            subtext={`+${formatCurrency(valueGrowth)} (+${valueGrowthPercentage.toFixed(1)}%)`}
            subtextColor="success.main"
          />
          
          <MetricBox 
            label="Loan Balance" 
            value={formatCurrency(latestLoanBalance)}
          />
          
          <MetricBox 
            label="Equity" 
            value={formatCurrency(latestEquity)}
            subtext={`${latestEquityPercentage.toFixed(1)}% of home value`}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default HomeValue; 