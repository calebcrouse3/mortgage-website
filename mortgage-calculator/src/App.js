import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import { MortgageCalculator } from './models/Calculator';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
  },
});

function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to run the simulation when Calculate is clicked
  const handleCalculate = () => {
    setLoading(true);
    
    // Use setTimeout to allow the UI to update with loading state
    setTimeout(() => {
      try {
        // Wrap in a try/catch to handle any calculation errors
        const calculator = new MortgageCalculator(window.contextValue);
        const results = calculator.runSimulation();
        setSimulationData(results);
      } catch (error) {
        console.error('Calculation error:', error);
        // You could set an error state here and display it to the user
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          height: '100vh',
          overflow: 'hidden',
          p: 2,
          gap: 2,
          bgcolor: '#f5f5f5'
        }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', md: '380px' },
            height: { xs: 'auto', md: '100%' },
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            <Sidebar onCalculate={handleCalculate} />
          </Box>
          
          {/* Main Content */}
          <Box sx={{ 
            flex: 1,
            height: { xs: 'auto', md: '100%' },
            overflow: 'auto',
          }}>
            <MainContent 
              simulationData={simulationData}
              loading={loading}
            />
          </Box>
        </Box>
        
        {/* Store context in window for easy access by calculator */}
        <ContextCapture />
      </AppProvider>
    </ThemeProvider>
  );
}

// Helper component to capture context for use in the calculator
const ContextCapture = () => {
  const context = useAppContext();
  
  React.useEffect(() => {
    // Store context in window for access by calculator
    window.contextValue = context;
  }, [context]);
  
  return null;
};

export default App;
