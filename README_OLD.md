# Mortgage Payment Analysis Tool Conversion Project

## Project Analysis

### Project Overview
This project is a comprehensive mortgage payment analysis tool built with Python and Streamlit. It allows users to analyze mortgage payments, home values, investment comparisons, and various financial metrics through an interactive web interface. The application features:

1. **Interactive Input Fields** - A sidebar with multiple expandable sections containing input fields for:
   - Mortgage details (home price, down payment, interest rate, etc.)
   - Expenses (property tax, insurance, HOA fees, utilities, maintenance)
   - Economic factors (home appreciation, inflation rate)
   - Rental income (monthly rent, vacancy rate, management fees)
   - Selling costs (income tax, realtor fees, capital gains tax)
   - Chart display options

2. **Financial Visualizations** - Multiple tabs with different charts:
   - Monthly payment breakdowns
   - Loan amortization charts
   - Investment comparisons
   - Rent vs. buy analysis
   - Home value projections
   - Cash flow analysis
   - Return on investment metrics

3. **Financial Calculations** - Complex financial calculations including:
   - Mortgage amortization
   - PMI calculations based on equity
   - Property appreciation
   - Investment growth comparisons
   - Tax implications
   - Cash-on-cash returns and IRR

### Code Structure
- **calculator.py**: Main application file containing UI elements, simulation functions, and visualization code
- **utils.py**: Helper functions for UI components, formatting, and plotting
- **utils_finance.py**: Financial calculation functions (amortization, PMI, growth calculations)
- **session_state_interface.py**: Manages application state and form inputs
- **finance_descriptions.py**: Contains definitions for financial terms
- **style.css**: Custom styling for the Streamlit interface

### Key Components and Features
1. **Session State Management**: Custom implementation for managing form inputs and state
2. **Interactive Simulations**: Month-by-month financial simulations over 30 years
3. **Data Visualization**: Interactive charts using Plotly
4. **Financial Metrics**: Comprehensive financial metrics including ROI, IRR, cash flow
5. **Comparison Scenarios**: Rent vs. buy, different investment strategies
6. **Responsive UI**: Expandable sections, tooltips, and responsive charts

## React Conversion Plan

### Phase 1: Project Setup and Environment

1. **Create React Project**
   ```bash
   npx create-react-app mortgage-calculator
   cd mortgage-calculator
   ```

2. **Install Key Dependencies**
   ```bash
   npm install react-router-dom plotly.js react-plotly.js @mui/material @emotion/react @emotion/styled styled-components
   ```

3. **Project Structure**
   ```
   /src
     /components
       /layout
         Sidebar.js
         MainContent.js
       /inputs
         MortgageInputs.js
         ExpenseInputs.js
         EconomicFactors.js
         RentalIncome.js
         SellingInputs.js
         ChartOptions.js
       /charts
         AmortizationChart.js
         ExpenseBreakdown.js
         InvestmentComparison.js
         RentVsBuy.js
         HomeValue.js
         CashFlow.js
       /tabs
         TabContainer.js
     /models
       Calculator.js
       Finance.js
     /hooks
       useFormState.js
     /context
       AppContext.js
     /utils
       formatters.js
     App.js
     index.js
   ```

### Phase 2: State Management and Data Model

1. **Create Context Provider**
   - Implement React Context for global state management
   - Convert SessionStateInterface to React context

2. **Implement Financial Models**
   - Port core financial calculations from utils_finance.py
   - Create pure JavaScript functions for calculations

3. **Create Form Hooks**
   - Implement custom hooks for form state management
   - Add validation and formatting helpers

### Phase 3: UI Components

1. **Layout Components**
   - Implement responsive layout with sidebar and main content
   - Create collapsible panel components similar to Streamlit expanders

2. **Input Components**
   - Create reusable input components (currency inputs, percentage inputs)
   - Implement form groups for the different input categories

3. **Chart Components**
   - Implement Plotly.js charts similar to the Python implementation
   - Create reusable chart components with consistent styling

4. **Tab Navigation**
   - Implement tab navigation between different visualizations
   - Add responsive design for different screen sizes

### Phase 4: Core Functionality

1. **Simulation Logic**
   - Port the monthly simulation function to JavaScript
   - Implement the calculation pipeline

2. **Chart Generation**
   - Convert the Plotly chart generation code to React
   - Implement interactive features (tooltips, zoom)

3. **Data Aggregation**
   - Implement functions to aggregate monthly data into yearly views
   - Create metrics calculation functions

### Phase 5: Styling and Polish

1. **Implement Styling**
   - Create consistent theme with styled-components or Material UI
   - Implement responsive design adaptations

2. **Add Tooltips and Help**
   - Implement tooltips for input fields
   - Add help text for financial terms

3. **Improve User Experience**
   - Add loading states during calculations
   - Implement field validation
   - Add responsive design improvements

### Phase 6: Testing and Deployment

1. **Unit Testing**
   - Test financial calculation functions
   - Validate output against Python implementation

2. **Integration Testing**
   - Test full application flow
   - Verify calculations match original implementation

3. **Deployment**
   - Deploy to GitHub Pages or Netlify
   - Add analytics to track usage

## Implementation Notes

### React vs. Python Differences

1. **State Management**
   - Python's session state will be replaced with React's useState/useContext
   - Form handling will use controlled components

2. **Calculation Engine**
   - Python's numerical libraries (NumPy, Pandas) will be replaced with JavaScript alternatives
   - Consider using libraries like mathjs for complex calculations

3. **Visualization**
   - Plotly.js works in both environments but API differences exist
   - May need to adapt some visualization code

4. **Performance Considerations**
   - JavaScript calculations may be slower for large datasets
   - Consider web workers for computation-heavy tasks
   - Use memoization to avoid redundant calculations

### Key Challenges

1. **Financial Calculations**
   - Ensuring accuracy in JavaScript vs. Python numerical computations
   - Implementing equivalent functionality for NumPy and Pandas operations

2. **State Management Complexity**
   - Managing the large number of interdependent inputs
   - Maintaining calculation efficiency with state updates

3. **Visualization Parity**
   - Matching the look and functionality of the Plotly charts
   - Ensuring interactive features work similarly

## Getting Started

To begin the conversion process:

1. Review the existing Python code to fully understand the calculations
2. Set up the React project structure
3. Implement the basic UI layout and navigation
4. Port the core financial calculations
5. Connect the UI to the calculation engine
6. Implement the chart visualizations

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [Material UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

# Future Work
- Total returns versus downpayment analysis
- What expense increases does inflation drive?
- Insurance default value / estimation
- Event Injector
- Save simulation inputs
- Upload previous simulation inputs
- Zillow link
- Refinancing calculator
- Actual formula for renting vs ownership - reccomendations for rent vs own. 5 percent rule?
    - Based on the home, give the rental that will have the correct crossover point
- Tooltips with hover over and no (?)
- ICB ads
- About page
- Specifics of capital gains and how it effects stock and home sale price
    - The 2 year window for capital gains tax free sale


# Prompt

This project is a mortgage payment analysis tool. Its build with python and streamlit. The webpage has a side bar with various input and the main page has charts that display details about mortgage payments, timelines of home values, etc. The main page has a link bar that switched between different visualizations. Some visualizations have additional inputs. 

I want to convert this whole project to a react website. It does not need a backend. There is no user logons. Its just the interactive webapp with visualizations. Start by doing a detailed analysis of the project and put all your documentation in the readme. Make it very detailed and helpful for completing the task of converting this project to react. After doing you analysis of the project and its functionality, write out the steps to convert this project to a react webapp. I want to keep the project as simple as possible to start and build in complexity from there. I have very limited experience with web development.

# Add Details Here