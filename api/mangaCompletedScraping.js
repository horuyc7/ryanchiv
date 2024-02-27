const puppeteer = require('puppeteer');


module.exports = async (req, res) => {
        try {
          const browser = await puppeteer.launch({
            product: 'firefox',
          });
          const page = await browser.newPage();
          await page.goto('https://myanimelist.net/mangalist/hunchojhuncho99?status=2&order=4&order2=0');
      
          await page.waitForSelector('.list-table');
      
          const mangaData = await page.evaluate(() => {
            
              const mangaElements = document.querySelectorAll('.list-item');
              const manga = [];
              mangaElements.forEach(element => {
                  const titleElement = element.querySelector('.link.sort');
                  const title = titleElement ? titleElement.getAttribute('href') : '';
      
      
                  const imageElement = element.querySelector('img');
                  const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
      
                  const ratingElement = element.querySelector('.score-label');
                  const rating = ratingElement ? ratingElement.textContent.trim() : '';
      
          
      
                  manga.push({ title, imageUrl, rating });
      
      
              });
      
        
          
              return manga;
          });
      
          await browser.close();
      
          res.json(mangaData);
        } catch (error) {
          console.error('Error scraping:', error);
          res.status(500).json({ error: 'Failed to scrape data' });
        }
    }
      
