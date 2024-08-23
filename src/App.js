import React, { useEffect } from 'react';
import MainPage from './mainPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './style/theme';

function App() {
  useEffect(() => {
    fetch('/csrf-token', {
      method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
        if (!csrfMetaTag) {
            csrfMetaTag = document.createElement('meta');
            csrfMetaTag.setAttribute('name', 'csrf-token');
            document.head.appendChild(csrfMetaTag);
        }
        csrfMetaTag.setAttribute('content', data.csrfToken);
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
