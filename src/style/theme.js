import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: { 
    htmlFontSize: 10, // Tell Material UI what the font-size on the html element is.
  },
  palette: {
    primary: {
      main: '#358585',
    },
    secondary: {
      main: '#4ae8e8',
    },
    background: {
      default: '##bae0e0', 
      paper: '#f5ffff', 
    },
    text: {
      primary: '#414545', 
      secondary: '#4ae8e8',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4ae8e8', // Change the default label color
          '&.Mui-focused': {
            color: '#4ae8e8', // Change the label color when focused
          },
        },
      },
    }
  }
});

export default theme;