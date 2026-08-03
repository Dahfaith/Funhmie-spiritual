const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const content = await page.content();
    console.log('BODY LENGTH:', content.length);
  } catch (err) {
    console.error('Error opening page:', err);
  } finally {
    await browser.close();
  }
})();
