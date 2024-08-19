const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/fetch-metadata', (req, res) => {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid input, expected an array of URLs.' });
    }

    const metadataPromises = urls.map((url) => {
        return axios.get(url)
            .then((response) => {
                const dom = new JSDOM(response.data);
                const { document } = dom.window;

                const title = document.querySelector('title') ? document.querySelector('title').textContent : '';
                const description = document.querySelector('meta[name="description"]')
                    ? document.querySelector('meta[name="description"]').getAttribute('content')
                    : '';
                const image = document.querySelector('meta[property="og:image"]')
                    ? document.querySelector('meta[property="og:image"]').getAttribute('content')
                    : '';

                return { url, title, description, image };
            })
            .catch((error) => {
                return { url, error: 'Failed to fetch metadata' };
            });
    });

    Promise.all(metadataPromises)
        .then((metadata) => {
            res.json(metadata);
        })
        .catch((error) => {
            res.status(500).json({ error: 'An error occurred while fetching metadata' });
        });
});

  