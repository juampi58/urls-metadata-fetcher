import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Main color for primary palette
      light: '#63a4ff', // Light shade of primary
      dark: '#004ba0', // Dark shade of primary
      contrastText: '#ffffff', // Text color when using primary colors
    },
    secondary: {
      main: '#dc004e', // Main color for secondary palette
      light: '#ff616f', // Light shade of secondary
      dark: '#9a0036', // Dark shade of secondary
      contrastText: '#ffffff', // Text color when using secondary colors
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f5f5', // Default background color
      paper: '#ffffff', // Background color for paper components
    },
    text: {
      primary: '#000000', // Default text color
      secondary: '#ffffff', // Secondary text color
    },
  },
});

export default theme;