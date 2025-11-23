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
        $list('.poster-container').each((index, element) => {
            const href = $list(element).find('[data-target-link]').attr('data-target-link');

            // NEW: Extract poster directly from the list HTML
            const posterElement = $list(element).find('.film-poster');

            // Try multiple attributes Letterboxd uses
            const imageUrl =
                posterElement.find('img').attr('src') ||      // fallback
                posterElement.find('img').attr('srcset');     // last fallback

            moviesData.push({
                href,
                imageUrl
            });
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


            const userReviews = [];
            $movie('.film-detail').each((index, element) => {
                if (index < 3) { // Only extract bodyText for the first two movies
                    
                    
                    const $detail = $movie(element);

                    const hiddenSpoilersExist = $detail.find('.hidden-spoilers').length > 0;
                    
                    
                    
                    let bodyText;
                    if (hiddenSpoilersExist) {
                        bodyText = $detail.find('.hidden-spoilers p').text().trim();
                    } else {
                        bodyText = $detail.find('.body-text p').text().trim();
                    }

                    //const  bodyText = $detail.find('.body-text p').text().trim();
                   
                    const name = $detail.find('.attribution-block .name').text().trim();
                    const rating = $detail.find('.rating.-green').text().trim();
                    
                    const review = {
                        name: name,
                        rating: rating,
                        text: bodyText
                    };
                    
                    
                    userReviews.push(review);
                }
            });

            return { title, rating, tagline, description, genres, userReviews};
        });

        const moviesDetails = await Promise.all(moviesDetailsPromises);


        res.json({ moviesData, listDetails, moviesDetails });
    } catch (error) {
        console.error('Error scraping movies:', error);
        throw error;
    }
}