import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper, Typography } from '@mui/material';
import { formatCurrency } from '../../models/Finance';

// Constants for chart styling
const BLUE = "#1f77b4";
const ORANGE = "#ff7f0e";
const GREEN = "#2ca02c";

const PLOT_COLORS = [BLUE, ORANGE, GREEN];

/**
 * AmortizationChart component
 * Displays principal vs interest over time
 */
const AmortizationChart = ({ yearlyData, xlim, chartMode }) => {
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
  const principalData = yearlyData.map((d) => d.principalExp);
  const interestData = yearlyData.map((d) => d.interestExp);
  const totalPayments = yearlyData.map((d) => d.principalExp + d.interestExp);

  // Configure traces based on chart mode
  const mode = chartMode === 'Lines' ? 'lines' : 'markers';
  const lineWidth = chartMode === 'Lines' ? 4 : 0;
  const markerSize = chartMode === 'Dots' ? 10 : 0;

  // Create the traces for plotting
  const traces = [
    {
      x: years,
      y: principalData,
      name: 'Principal',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[0] },
      marker: { size: markerSize, color: PLOT_COLORS[0] },
      hovertemplate: '$%{y:,.0f}<extra>Principal</extra>',
    },
    {
      x: years,
      y: interestData,
      name: 'Interest',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[1] },
      marker: { size: markerSize, color: PLOT_COLORS[1] },
      hovertemplate: '$%{y:,.0f}<extra>Interest</extra>',
    },
    {
      x: years,
      y: totalPayments,
      name: 'Total',
      type: 'scatter',
      mode: mode,
      line: { width: lineWidth, color: PLOT_COLORS[2] },
      marker: { size: markerSize, color: PLOT_COLORS[2] },
      hovertemplate: '$%{y:,.0f}<extra>Total Payment</extra>',
    },
  ];

  // Calculate totals for the summary
  const totalPrincipal = principalData.reduce((sum, val) => sum + val, 0);
  const totalInterest = interestData.reduce((sum, val) => sum + val, 0);
  const totalPayment = totalPrincipal + totalInterest;

  // Layout configuration
  const layout = {
    title: 'Principal vs Interest Over Time',
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Loan Amortization
      </Typography>
      
      <Plot
        data={traces}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
      
      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="primary">
            Total Principal
          </Typography>
          <Typography variant="h6">
            {formatCurrency(totalPrincipal)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="primary">
            Total Interest
          </Typography>
          <Typography variant="h6">
            {formatCurrency(totalInterest)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="primary">
            Total Payments
          </Typography>
          <Typography variant="h6">
            {formatCurrency(totalPayment)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default AmortizationChart; 