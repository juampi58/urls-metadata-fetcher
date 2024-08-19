import React, { useState } from 'react';
import axios from 'axios';


const UrlForm = () => {
  const [urls, setUrls] = useState(['']);
  const [metadata, setMetadata] = useState([]);
  const [error, setError] = useState('');

  const handleUrlChange = (index, event) => {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  };

  const addUrlInput = () => {
    if (urls.length < 3) {
      setUrls([...urls, '']);
    } else {
      setError('You can only enter up to 3 URLs.');
    }
  };

  const removeUrlInput = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    if (urls.length <= 3) {
      setError(''); // Clear the error if the number of inputs is now under the limit
    }
  };

const handleSubmit = (event) => {
    event.preventDefault();
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    setError('');
    setMetadata([]);

    axios.post('/fetch-metadata', { urls }, {headers: { 'CSRF-Token': csrfToken}})
        .then(response => {
            console.log(response.data);
            setMetadata(response.data);
        })
        .catch(error => {
            setError('Failed to fetch metadata. Please check the URLs and try again.');
        });
};

return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Enter URLs to Fetch Metadata</h2>
        <form onSubmit={handleSubmit}>
            {urls.map((url, index) => (
                <div key={index} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={url}
                        onChange={(event) => handleUrlChange(index, event)}
                        placeholder="Enter URL"
                        required
                    />
                    {urls.length > 1 && (
                        <button type="button" onClick={() => removeUrlInput(index)}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            {urls.length < 3 && (
                <button type="button" onClick={addUrlInput}>
                    Add Another URL
                </button>
            )}
            <button type="submit">Submit</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {metadata.length > 0 && (
            <div>
                <h3></h3>
                {metadata.map((data, index) => (
                    <div key={index} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
                        <p><strong>Title:</strong> {data.title}</p>
                        <p><strong>Description:</strong> {data.description}</p>
                        {data.image && <img src={data.image} alt="Metadata" style={{ maxWidth: '100px' }} />}
                    </div>
                ))}
            </div>
        )}
    </div>
);
};

export default UrlForm;
