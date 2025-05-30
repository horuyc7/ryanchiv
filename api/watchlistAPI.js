const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    try {
        const listUrls = process.env.LETTERBOXD_WATCHLIST.split(',').map(url => url.trim());

        const allMoviesData = [];
        const allMoviesDetails = [];
        const listDetailsCombined = {
            titles: [],
            descriptions: []
        };

        for (const url of listUrls) {
            const responseList = await axios.get(url);
            const $list = cheerio.load(responseList.data);

            const listTitle = $list('.title-1').text().trim();
            const listDescription = $list('.body-text p').text().trim();

            listDetailsCombined.titles.push(listTitle);
            listDetailsCombined.descriptions.push(listDescription);

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
            allMoviesData.push(...moviesData);

            const moviesDetailsPromises = moviesData.map(async movie => {
                const responseMovie = await axios.get(`https://letterboxd.com${movie.href}`);
                const $movie = cheerio.load(responseMovie.data);

                const title = $movie('.headline-1').text().trim();
                const tagline = $movie('.tagline').text().trim();
                const description = $movie('.truncate p').text().trim();
                const genres = [];

                $movie('#tab-genres .text-sluglist a').each((_, el) => {
                    genres.push($movie(el).text());
                });

                const responseRating = await axios.get(`https://letterboxd.com/csi${movie.href}rating-histogram`);
                const $rating = cheerio.load(responseRating.data);
                const rating = $rating('.average-rating a').text().trim();

                const userReviews = [];
                $movie('.film-detail').each((i, el) => {
                    if (i < 3) {
                        const $detail = $movie(el);
                        const hiddenSpoilersExist = $detail.find('.hidden-spoilers').length > 0;

                        const bodyText = hiddenSpoilersExist
                            ? $detail.find('.hidden-spoilers p').text().trim()
                            : $detail.find('.body-text p').text().trim();

                        const name = $detail.find('.attribution-block .name').text().trim();
                        const reviewRating = $detail.find('.rating.-green').text().trim();

                        userReviews.push({ name, rating: reviewRating, text: bodyText });
                    }
                });

                return { title, rating, tagline, description, genres, userReviews };
            });

            const moviesDetails = await Promise.all(moviesDetailsPromises);
            allMoviesDetails.push(...moviesDetails);
        }

        const listDetails = {
            title: listDetailsCombined.titles.join(', '),
            description: listDetailsCombined.descriptions.join('\n\n'),
        };

        res.json({
            moviesData: allMoviesData,
            listDetails,
            moviesDetails: allMoviesDetails
        });
    } catch (error) {
        console.error('Error scraping movies:', error);
        res.status(500).json({ error: 'Error scraping watchlists' });
    }
};
