const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        const watchlistUrls = process.env.LETTERBOXD_WATCHLIST.split(',');

        const allWatchlistData = [];

        for (const url of watchlistUrls) {
            const responseList = await axios.get(url);
            const $list = cheerio.load(responseList.data);

            const listDetails = {
                title: $list('.title-1').text().trim(),
                description: $list('.body-text p').text().trim(),
            };

            const moviesData = [];
            const posterPromises = [];

            $list('.poster-container').each((index, element) => {
                const href = $list(element).find('[data-target-link]').attr('data-target-link');
                const posterUrl = `https://letterboxd.com/ajax/poster${href}std/1000x1300/`;

                posterPromises.push(
                    axios.get(posterUrl)
                        .then(posterResponse => {
                            const $poster = cheerio.load(posterResponse.data);
                            const imageUrl = $poster('img').attr('src') || $poster('img').attr('srcset');
                            moviesData.push({ href, imageUrl });
                        })
                        .catch(error => {
                            console.error('Error fetching poster:', error);
                        })
                );
            });

            await Promise.all(posterPromises);

            const moviesDetailsPromises = moviesData.map(async movie => {
                const responseMovie = await axios.get(`https://letterboxd.com${movie.href}`);
                const $movie = cheerio.load(responseMovie.data);

                const title = $movie('.headline-1').text().trim();
                const tagline = $movie('.tagline').text().trim();
                const description = $movie('.truncate p').text().trim();

                const genres = [];
                $movie('#tab-genres .text-sluglist a').each((i, el) => {
                    genres.push($movie(el).text());
                });

                const responseRating = await axios.get(`https://letterboxd.com/csi${movie.href}rating-histogram`);
                const $rating = cheerio.load(responseRating.data);
                const rating = $rating('.average-rating a').text().trim();

                const userReviews = [];
                $movie('.film-detail').each((index, element) => {
                    if (index < 3) {
                        const $detail = $movie(element);
                        const hiddenSpoilers = $detail.find('.hidden-spoilers');
                        const bodyText = hiddenSpoilers.length > 0 ?
                            hiddenSpoilers.find('p').text().trim() :
                            $detail.find('.body-text p').text().trim();

                        const name = $detail.find('.attribution-block .name').text().trim();
                        const reviewRating = $detail.find('.rating.-green').text().trim();

                        userReviews.push({ name, rating: reviewRating, text: bodyText });
                    }
                });

                return { title, rating, tagline, description, genres, userReviews };
            });

            const moviesDetails = await Promise.all(moviesDetailsPromises);

            allWatchlistData.push({
                listDetails,
                movies: moviesData,
                moviesDetails,
            });
        }

        res.json({ watchlists: allWatchlistData });
    } catch (error) {
        console.error('Error scraping movies:', error);
        res.status(500).json({ error: 'Failed to fetch watchlists' });
    }
};
