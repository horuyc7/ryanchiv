const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        //get letterboxd link from vercel env var
        const response = await axios.get(process.env.LETTERBOXD_LIST);

        //load html from link
        const $ = cheerio.load(response.data);

        //get list title and description from html
        const listDetails = {
            title: $('.title-1').text().trim(),
            description: $('.body-text p').text().trim(),
        };

        const moviesData = [];
        const posterPromises = [];

        //get every movies from list
        $('.poster-container').each(async  (index, element) => {
            const href = $(element).find('[data-target-link]').attr('data-target-link');
  
            const posterUrl = `https://letterboxd.com/ajax/poster${href}std/300x450/`;

            posterPromises.push(
                axios.get(posterUrl)
                    .then(posterResponse => {
                        const posterData = posterResponse.data;
                        const imageUrl = $(posterData).find('img').attr('src') || $(posterData).find('img').attr('srcset');
                        moviesData.push({ href, imageUrl });
                    })
                    .catch(error => {
                        console.error('Error fetching poster:', error);
                    })
            );
    
        });

        await Promise.all(posterPromises);

        res.json({ listDetails, moviesData });
    } catch (error) {
        console.error('Error scraping movies:', error);
        throw error;
    }
}

