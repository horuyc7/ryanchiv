const axios = require('axios');
const cheerio = require('cheerio');
const { cache } = require('react');

module.exports = async (req, res) => {
    try {
        const responseList = await axios.get(process.env.LETTERBOXD_LIST);
        const $list = cheerio.load(responseList.data);

        const listDetails = {
            title: $list('.title-1').text().trim(),
            description: $list('.body-text p').text().trim(),
        };

        const moviesData = [];
        const posterPromises = [];

        // Get every movie from the list
        $list('.posteritem').each((i, el) => {

            const slug = $list(el).find('.react-component').attr('data-item-slug');

            const href = $list(el)
                .find('[data-target-link]')
                .attr('data-target-link');

            if (!href) return;

            moviesData.push({
                href,
                slug
            });
        });


        await Promise.all(posterPromises);

        // Fetch details for each movie
        const moviesDetailsPromises = moviesData.map(async movie => {
            const responseMovie = await axios.get(`https://letterboxd.com${movie.href}`);
            const $movie = cheerio.load(responseMovie.data);

            const title = $movie('.headline-1').text().trim();
            const tagline = $movie('.tagline').text().trim();
            const description = $movie('.truncate p').text().trim();
            const genres = [];
            $movie('#tab-panel-genres .text-sluglist a').each((index, element) => {
                genres.push($movie(element).text());
            });

            const jsonLd = $movie('script[type="application/ld+json"]').html();

            const cleaned = jsonLd
                        .replace(/\/\*[\s\S]*?\*\//g, '')
                        .trim();

            let imageUrl2 = null;

            try {
                const data = JSON.parse(cleaned);
                imageUrl2 = data.image;
            } catch (e) {
                console.log('JSON parse failed', e);
            }

            const ratingRaw = $movie('meta[name="twitter:data2"]').attr('content');

            let rating = null;

            if (ratingRaw) {
                const match = ratingRaw.match(/[\d.]+/);
                rating = match ? Math.round(parseFloat(match[0]) * 10) / 10 : null;
            }

            return { title, rating, tagline, description, genres, imageUrl2};
        });

        const moviesDetails = await Promise.all(moviesDetailsPromises);

        res.json({ moviesData, listDetails, moviesDetails });

    } catch (error) {
        console.error('Error scraping movies:', error);
        throw error;

    }
}