const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');

async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar'
    ),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

module.exports = async (req, res) =>{
        try {
          
         /*
          const browser = await puppeteer.launch({
            executablePath: require('puppeteer').executablePath(),
          });  */

          const browser = await getBrowser();

          const page = await browser.newPage();
          await page.goto('https://letterboxd.com/stoopidass/list/fav/');
      
          // Wait for the list to load
          //await page.waitForSelector('.poster-container', { timeout: 10000 });
          await page.waitForSelector('.list-title-intro');
      
          const listDetails = await page.evaluate(() => {
              const titleElement = document.querySelector('.title-1');
              const descriptionElement = document.querySelector('.body-text');
        
              const title = titleElement ? titleElement.textContent.trim() : '';
              const description = descriptionElement ? descriptionElement.textContent.trim() : '';
        
              return { title, description };
            });
      
          // Scraping logic to get movie titles and image URLs
          const moviesData = await page.evaluate(() => {
            
              const movieElements = document.querySelectorAll('.poster-container');
              const movies = [];
              movieElements.forEach(element => {
                  const titleElement = element.querySelector('.frame');
                  const title = titleElement ? titleElement.getAttribute('href') : '';
      
      
                  const imageElement = element.querySelector('img');
                  const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
      
          
      
                  movies.push({ title, imageUrl });
              });
      
        
              
              return movies;
          });
      
          await browser.close();
          
      
          res.json({ listDetails, moviesData });
        } catch (error) {
          console.error('Error scraping:', error);
          res.status(500).json({ error: 'Failed to scrape data' });
        }
}