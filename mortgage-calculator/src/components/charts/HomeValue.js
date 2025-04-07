import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper, Typography } from '@mui/material';
import { formatCurrency } from '../../models/Finance';

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

  // For the equity percentage chart
  const equityPercentageTrace = {
    x: years,
    y: equityPercentages,
    name: 'Equity %',
    type: 'scatter',
    mode: mode,
    line: { width: lineWidth, color: PLOT_COLORS[3] },
    marker: { size: markerSize, color: PLOT_COLORS[3] },
    hovertemplate: '%{y:.1f}%<extra>Equity %</extra>',
  };

  const percentageLayout = {
    title: 'Equity Percentage Over Time',
    xaxis: {
      title: 'Year',
      range: [0, xlim + 1],
    },
    yaxis: {
      title: 'Equity (%)',
      tickformat: '.0%',
      tickvals: [0, 20, 40, 60, 80, 100],
      ticktext: ['0%', '20%', '40%', '60%', '80%', '100%'],
      range: [0, 100],
    },
    hovermode: 'x',
    height: 300,
    width: "100%",
    autosize: true,
    margin: { l: 60, r: 30, t: 50, b: 50 },
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
      
      <Plot
        data={traces}
        layout={valueLayout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
      
      <Plot
        data={[equityPercentageTrace]}
        layout={percentageLayout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Projected Values at Year {Math.min(xlim, yearlyData.length)}
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 2 
        }}>
          <Box sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <Typography variant="body2">Home Value</Typography>
            <Typography variant="subtitle1">{formatCurrency(latestHomeValue)}</Typography>
            <Typography variant="caption" color="success.main">
              +{formatCurrency(valueGrowth)} (+{valueGrowthPercentage.toFixed(1)}%)
            </Typography>
          </Box>
          
          <Box sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <Typography variant="body2">Loan Balance</Typography>
            <Typography variant="subtitle1">{formatCurrency(latestLoanBalance)}</Typography>
          </Box>
          
          <Box sx={{ p: 1, backgroundColor: 'rgba(0,0,0,0.03)' }}>
            <Typography variant="body2">Equity</Typography>
            <Typography variant="subtitle1">{formatCurrency(latestEquity)}</Typography>
            <Typography variant="caption" color="primary">
              {latestEquityPercentage.toFixed(1)}% of home value
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default HomeValue; 