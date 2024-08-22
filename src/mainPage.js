import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, TextField, IconButton, Box, Alert } from '@mui/material';
import DataCard from './components/DataCard/DataCard';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const MainPage = () => {
    const [urls, setUrls] = useState(['']);
    const [metadata, setMetadata] = useState([]);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('Fill in the URL field');
    const [loading, setLoading] = useState(false);

    const handleUrlChange = (index, event) => {
        const newUrls = [...urls];
        newUrls[index] = event.target.value;
        newUrls.some((url) => url === '') ? setWarning('Fill in the URL field') : setWarning('');
        setUrls(newUrls);
    };

    const addUrlInput = () => {
        setWarning('Fill in the URL field');
        if (urls.length < 3) {
            setUrls([...urls, '']);
            if (urls.length === 2) {
                setWarning('Fill in the URL field | You can only add up to 3 URLs');
            }
        }
    };

    const removeUrlInput = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
        newUrls.some((url) => url === '') ? setWarning('Fill in the URL field') : setWarning('');
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '5%',
                width: '90%',
                height: '100%'
            }}
            bgcolor='background.default'
        >
            <Typography variant='h3' sx={{ alignSelf: 'center', color: 'primary' }}>Metadata Fetcher</Typography>
            <Box
                component='form'
                onSubmit={handleSubmit}
                sx={{ display: 'flex', height: '40%', borderBottom: 'solid lightgray 2px' }}
            >
                <Box
                    sx={{
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRight: 'solid lightgray 2px',
                        justifyContent: 'space-evenly'
                    }}
                >
                    {urls.map((url, index) => (
                        <Box key={index} sx={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', width: '90%' }}>
                            <TextField
                                sx={{ width: '100%' }}
                                label="URL"
                                value={url}
                                name={'url'+(index+1)}
                                onChange={(e) => handleUrlChange(index, e)}
                            />
                            {urls.length > 1 && (
                                <IconButton onClick={() => removeUrlInput(index)} id={`remove-url-input${index+1}`}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginLeft: '1rem',
                        width: '20%'
                    }}
                >
                    <Button
                        id="add-url-input"
                        variant="outlined"
                        onClick={addUrlInput}
                        startIcon={<AddIcon />}
                        disabled={urls.length > 2}
                        sx={{ width: '15rem', height: '2.5rem' }}
                    >
                        <Typography variant='button'>More URLs</Typography>
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="outlined"
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<SendIcon />}
                        sx={{ width: '15rem', height: '2.5rem' }}
                    >
                        <Typography variant='button'>Submit</Typography>
                    </LoadingButton>
                </Box>
            </Box>

            {error && <Alert sx={{marginTop: '2rem'}} severity="error" onClose={() => setError('')} className="metadata-fetcher-error">{error}</Alert>}
            {warning && <Alert sx={{marginTop: '2rem'}} severity="warning" onClose={() => setWarning('')}className='metadata-fetcher-warning'>{warning}</Alert>}

            {metadata.length > 0 && (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-evenly', 
                        marginTop: '3rem', 
                        height:'50%',
                    }}
                >
                    {metadata.map((data, index) => (
                        <DataCard key={index} customKey={`metadata-card${index+1}`} item={data} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MainPage;
