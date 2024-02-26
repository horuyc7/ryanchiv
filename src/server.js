const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Allow requests from any origin
app.use(cors());

app.get('/scrap/movie', async (req, res) => {
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

    res.json({ listDetails, moviesData });
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.get('/scrap/manga/currently', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://myanimelist.net/mangalist/hunchojhuncho99?status=1');

    // Wait for the list to load
    //await page.waitForSelector('.poster-container', { timeout: 10000 });
    await page.waitForSelector('.list-table');

    // Scraping logic to get movie titles and image URLs
    const mangaData = await page.evaluate(() => {
      
        const mangaElements = document.querySelectorAll('.list-item');
        const manga = [];
        mangaElements.forEach(element => {
            const titleElement = element.querySelector('.link.sort');
            const title = titleElement ? titleElement.getAttribute('href') : '';


            const imageElement = element.querySelector('img');
            const imageUrl = imageElement ? imageElement.getAttribute('src') : '';

    

            manga.push({ title, imageUrl });


        });

  
    
        return manga;
    });

    await browser.close();

    res.json(mangaData);
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});


app.get('/scrap/manga/completed', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
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
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});