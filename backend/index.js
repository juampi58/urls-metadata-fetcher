
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import bp from 'body-parser';
import * as cheerio from 'cheerio';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1 )

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // Cahnge this to 5 before handing in
    message: "Too many requests from this IP, please try again after a minute", 
    standardHeaders: true, 
    legacyHeaders: false, 
  });


app.use(express.static(path.join(__dirname, '../build')));


app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"], // Default policy
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
      },
    })
  );
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.use(limiter);

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      console.error('Invalid CSRF Token:', req.headers['csrf-token']);
      console.error('CSRF token validation failed');
      return res.status(403).send('Invalid CSRF token');
    }
    next(err);
  });



app.get('/csrf-token', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ csrfToken: req.csrfToken() });
  });

app.post('/fetch-metadata',csrfProtection,[
            body('urls').isArray().withMessage('URLs must be an array'),
            body('urls.*').isURL().withMessage('Each item must be a valid URL'),
        ], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }      
    const { urls } = req.body;

    const metadataPromises = urls.map((url) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body); 
            const title = $('title').text() || '';
            const description = $('meta[name="description"]').attr('content') || '';
            const image = $('meta[property="og:image"]').attr('content') || '';
            return { url, title, description, image };
        })
        .catch(error => {
            console.error('Error:', error);
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


export default app;
  