import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, TextField, IconButton, Box } from '@mui/material';
import UrlData from './components/urlData';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const MainPage = () => {
    const [urls, setUrls] = useState(['']);
    const [metadata, setMetadata] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            setError('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        setError('');
        setMetadata([]);
        axios
            .post('/fetch-metadata', { urls }, { headers: { 'CSRF-Token': csrfToken } })
            .then((response) => {
                setMetadata(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch metadata. Please check the URLs and try again.');
                setLoading(false);
            });
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '5%',
                width: '90%',
                backgroundColor: 'offwhite',
                height: '100%'
            }}
        >
            <h1 style={{ alignSelf: 'center', color: 'gray' }}>Metadata Fetcher</h1>
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', height: '40%', borderBottom: 'solid lightgray 2px' }}
            >
                <Box
                    style={{
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRight: 'solid lightgray 2px',
                        justifyContent: 'space-evenly'
                    }}
                >
                    {urls.map((url, index) => (
                        <div key={index} style={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', width: '90%' }}>
                            <TextField
                                style={{ width: '100%' }}
                                label="URL"
                                value={url}
                                onChange={(e) => handleUrlChange(index, e)}
                            />
                            {urls.length > 1 && (
                                <IconButton onClick={() => removeUrlInput(index)}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </div>
                    ))}
                </Box>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginLeft: '1rem',
                        width: '20%'
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={addUrlInput}
                        startIcon={<AddIcon />}
                        disabled={urls.length > 2}
                        style={{ width: '10rem', height: '2.5rem' }}
                    >
                        More URLs
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="outlined"
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<SendIcon />}
                        style={{ width: '10rem', height: '2.5rem' }}
                    >
                        Submit
                    </LoadingButton>
                </Box>
            </form>

            {error && <Typography style={{ color: 'error.main' }}>{error}</Typography>}

            {metadata.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '3rem', height:'50%' }}>
                    {metadata.map((data, index) => (
                        <UrlData key={index} item={data} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainPage;
