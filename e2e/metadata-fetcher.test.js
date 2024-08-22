import puppeteer from 'puppeteer-core';

jest.setTimeout(60000);

describe('Metadata Fetcher E2E Test', () => {
  
  let browser;
  let page;

  beforeAll(async () => {

        browser = await puppeteer.launch({ 
            headless: true, 
            executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
            //slowMo: 100
        });

        page = await browser.newPage();

  });

  afterAll(async () => {

    await browser.close();

  });

  test('should fetch and display metadata for URLs', async () => {

    await page.goto('http://localhost:3000');

    await page.type('input[name="url1"]', 'https://amazon.com');
    
    await page.click('button[type="submit"]');
    
    await page.waitForSelector('.metadata-card1'); 
    
    const metadataText1 = await page.$eval('.metadata-card1 .title', el => el.textContent);

    expect(metadataText1).toBe('Amazon.com');
    
  });
  
  test('should add and remove url inputs', async () => {

    await page.goto('http://localhost:3000');

    await page.click('#add-url-input');
    
    await page.waitForSelector('input[name="url2"]'); 
    
    await page.click('#add-url-input');
    
    await page.waitForSelector('input[name="url3"]'); 
    
    await page.click('#remove-url-input3');

    let input = await page.$('input[name="url3"]');
    
    expect(input).toBeNull();

    });

    test('should display a warning message if a URL field is empty', async () => {

    await page.waitForSelector('.metadata-fetcher-warning');

    const warning = await page.$eval('.metadata-fetcher-warning', el => el.textContent); 

    expect(warning).toBe('Fill in the URL field');

    }); 

    test('should display an error message if the URL is invalid', async () => {
        
    await page.type('input[name="url1"]', 'invalid-url');

    await page.click('button[type="submit"]');

    await page.waitForSelector('.metadata-fetcher-error');

    const error = await page.$eval('.metadata-fetcher-error', el => el.textContent);
    expect(error).toBe('Failed to fetch metadata. Please check the URLs and try again.');

    });

});             
