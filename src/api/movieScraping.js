const puppeteer = require('puppeteer');


export async function GET(request){
        try {
          const browser = await puppeteer.launch();
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
      
          return new Response({ listDetails, moviesData });
        } catch (error) {
          console.error('Error scraping:', error);
          return new Response().status(500).json({ error: 'Failed to scrape data' });
        }
}