import React, {useEffect} from 'react';
import UrlForm from './UrlForm';
import axios from 'axios';


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
    <div className="App">
      <h1>Metadata Fetcher</h1>
      <UrlForm />
    </div>
  );
}

export default App;
