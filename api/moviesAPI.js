const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        // Get letterboxd link from Vercel env var
        const responseList = await axios.get(process.env.LETTERBOXD_LIST);
        const $list = cheerio.load(responseList.data);

        // Get list title and description from HTML
        const listDetails = {
            title: $list('.title-1').text().trim(),
            description: $list('.body-text p').text().trim(),
        };

        const moviesData = [];
        const posterPromises = [];

        // Get every movie from list
        $list('.poster-container').each(async (index, element) => {
            const href = $list(element).find('[data-target-link]').attr('data-target-link');
            const posterUrl = `https://letterboxd.com/ajax/poster${href}std/300x450/`;

            posterPromises.push(
                axios.get(posterUrl)
                    .then(posterResponse => {
                        const posterData = posterResponse.data;
                        const imageUrl = cheerio.load(posterData)('img').attr('src') || cheerio.load(posterData)('img').attr('srcset');
                        moviesData.push({ href, imageUrl });
                    })
                    .catch(error => {
                        console.error('Error fetching poster:', error);
                    })
            );
        });

        await Promise.all(posterPromises);

        // Fetch additional details for each movie
        const moviesDetailsPromises = moviesData.map(async movie => {
            const responseMovie = await axios.get(`https://letterboxd.com${movie.href}`);
            const $movie = cheerio.load(responseMovie.data);

            const title = $movie('.headline-1').text().trim();
            const tagline = $movie('.tagline').text().trim();
            const description = $movie('.truncate p').text().trim();
            const genres = [];
            $movie('#tab-genres .text-sluglist a').each((index, element) => {
                genres.push($movie(element).text());
            });

            const responseRating = await axios.get(`https://letterboxd.com/csi${movie.href}rating-histogram`);
            const $rating = cheerio.load(responseRating.data);
            const rating = $rating('.average-rating a').text().trim();

            return { title, rating, tagline, description, genres };
        });

        const moviesDetails = await Promise.all(moviesDetailsPromises);

        res.json({ moviesData, listDetails, moviesDetails });
    } catch (error) {
        console.error('Error scraping movies:', error);
        throw error;
    }
}