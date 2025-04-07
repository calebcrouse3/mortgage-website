# Mortgage Payment Analysis Tool

A React-based mortgage calculator and analysis tool to help users understand mortgage payments, home values, expenses, and investment metrics.

## Features

- **Mortgage Calculations**: Calculate monthly payments, interest, principal, and total costs
- **Expense Analysis**: Visualize monthly expenses including property tax, insurance, and maintenance
- **Home Value Projections**: Track home value growth and equity over time
- **Interactive Charts**: View data in customizable charts with hover details
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone this repository or download the files
2. Navigate to the project directory
3. Install dependencies

```bash
cd mortgage-calculator
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```bash
npm run build
```

This will create a `build` folder with optimized production files.

## Usage

1. Fill out the mortgage details in the sidebar (home price, down payment, interest rate, etc.)
2. Click "Calculate" to generate analysis and visualizations
3. Navigate between different tabs to explore various aspects of the mortgage:
   - Loan Amortization
   - Monthly Expenses
   - Home Value & Equity
   - (More analyses coming soon)
4. Adjust inputs and recalculate to compare different scenarios

## Development

### Project Structure

- `/src/components/`: UI components
  - `/layout/`: Layout components (Sidebar, MainContent)
  - `/inputs/`: Input form components
  - `/charts/`: Chart visualization components
  - `/tabs/`: Tab navigation components
- `/src/models/`: Business logic and calculations
- `/src/context/`: State management with React Context
- `/src/utils/`: Utility functions

### Future Enhancements

- Rent vs. Buy analysis
- Return on Investment metrics
- Cash Flow analysis
- Investment comparisons
- Data export/save functionality
- Dark mode theme

## Technologies Used

- React.js
- Material UI
- Plotly.js
- React Router

## License

This project is licensed under the MIT License.

## Acknowledgments

This project is a React-based reimplementation of a Python/Streamlit mortgage analysis tool.
