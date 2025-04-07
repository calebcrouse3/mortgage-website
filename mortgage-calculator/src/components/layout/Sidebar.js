import React, { useState } from 'react';
import { Box, Paper, Divider, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MortgageInputs from '../inputs/MortgageInputs';
import ExpenseInputs from '../inputs/ExpenseInputs';
import EconomicFactors from '../inputs/EconomicFactors';
import RentalIncome from '../inputs/RentalIncome';
import SellingInputs from '../inputs/SellingInputs';
import ChartOptions from '../inputs/ChartOptions';
import { useAppContext } from '../../context/AppContext';

/**
 * Sidebar component containing all input sections in collapsible accordions
 */
const Sidebar = ({ onCalculate }) => {
  const { resetState } = useAppContext();
  const [expanded, setExpanded] = useState('mortgage'); // Default expanded panel
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  return (
    <Paper 
      elevation={3}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Inputs
      </Typography>
      
      <Divider />
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Accordion 
          expanded={expanded === 'mortgage'} 
          onChange={handleChange('mortgage')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Mortgage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MortgageInputs />
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'expenses'} 
          onChange={handleChange('expenses')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Expenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ExpenseInputs />
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'rental'} 
          onChange={handleChange('rental')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Rental Income</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RentalIncome />
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'economy'} 
          onChange={handleChange('economy')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Economy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <EconomicFactors />
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'selling'} 
          onChange={handleChange('selling')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Selling Fees/Taxes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SellingInputs />
          </AccordionDetails>
        </Accordion>
        
        <Accordion 
          expanded={expanded === 'chart'} 
          onChange={handleChange('chart')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Chart Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartOptions />
          </AccordionDetails>
        </Accordion>
      </Box>
      
      <Divider />
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onCalculate}
          sx={{ flex: 1 }}
        >
          Calculate
        </Button>
        
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={resetState}
          sx={{ flex: 1 }}
        >
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default Sidebar; 