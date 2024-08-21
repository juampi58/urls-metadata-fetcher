import React, { useEffect } from 'react';
import MainPage from './mainPage';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './style/theme';

function App() {
  useEffect(() => {
    axios.get('/csrf-token')
      .then(response => {
        let csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
        if (!csrfMetaTag) {
          csrfMetaTag = document.createElement('meta');
          csrfMetaTag.setAttribute('name', 'csrf-token');
          document.head.appendChild(csrfMetaTag);
        }
        csrfMetaTag.setAttribute('content', response.data.csrfToken);
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <MainPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
