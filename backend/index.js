
import express from 'express';
import axios from 'axios';
import bp from 'body-parser';
import { JSDOM } from 'jsdom';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';


const app = express();
app.set('trust proxy', 1 /* number of proxies between user and server */)
app.use(cookieParser());
const port = process.env.PORT || 5001;


const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests from this IP, please try again after a minute"
});
const csrfProtection = csrf({ cookie: true });

app.use(bp.json());
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(csrfProtection);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken(); // Generate the CSRF token
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Your App</title>
        <!-- Embed the CSRF token in a meta tag -->
        <meta name="csrf-token" content="${csrfToken}">
      </head>
      <body>
        <!-- Your HTML content here -->
      </body>
      </html>
    `);
  });
  
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

app.post('/fetch-metadata',[
            body('urls').isArray().withMessage('URLs must be an array'),
            body('urls.*').isURL().withMessage('Each item must be a valid URL'),
        ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }      
    const { urls } = req.body;

    const metadataPromises = urls.map((url) => {
        return axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }})
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

  