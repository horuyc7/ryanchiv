const axios = require('axios');
const cheerio = require('cheerio');
const { cache } = require('react');
const fs = require('fs');

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
        $list('.posteritem').each((i, el) => {

            const slug = $list(el).find('.react-component').attr('data-item-slug');

            const href = $list(el)
                .find('[data-target-link]')
                .attr('data-target-link');

            const raw = $list(el)
    .find('.react-component')
    .attr('data-resolvable-poster-path');

            let cacheBustingKey = null;

            if (raw) {
                try {
                    const decoded = raw
                        .replace(/&quot;/g, '"');

                    const parsed = JSON.parse(decoded);

                    cacheBustingKey = parsed.cacheBustingKey;
                } catch (err) {
                    cacheBustingKey = null;
                }
            }

            if (!href) return;

            moviesData.push({
                href,
                slug
            });
        });


        await Promise.all(posterPromises);

        // Fetch additional details for each movie
        const moviesDetailsPromises = moviesData.map(async movie => {
            const responseMovie = await axios.get(`https://letterboxd.com${movie.href}`);
            const $movie = cheerio.load(responseMovie.data);

            fs.writeFileSync(
            './letterboxd.html',
            responseMovie.data,
            'utf-8'
            );

            const title = $movie('.headline-1').text().trim();
            const tagline = $movie('.tagline').text().trim();
            //const description = $movie('.truncate p').text().trim();
            const genres = [];
            $movie('#tab-genres .text-sluglist a').each((index, element) => {
                genres.push($movie(element).text());
            });

            const jsonLd = $movie('script[type="application/ld+json"]').html();

            const cleaned = jsonLd
  .replace(/\/\*[\s\S]*?\*\//g, '') // remove /* ... */
  .trim();

            let imageUrl2 = null;

            try {
                const data = JSON.parse(cleaned);
                imageUrl2 = data.image;
            } catch (e) {
                console.log('JSON parse failed', e);
            }

            const rating = $movie('.averagerating').text().trim();

            return { title, rating, tagline, genres, imageUrl2};
        });

        const moviesDetails = await Promise.all(moviesDetailsPromises);

        res.json({ moviesData, listDetails, moviesDetails });

    } catch (error) {
        console.error('Error scraping movies:', error);
        throw error;

    }
}