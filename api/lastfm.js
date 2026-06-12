const cache = new Map();


export default async function handler(req, res) {

  const { artist } = req.query;

  if (!artist) {
    return res.status(400).json({ error: 'Missing artist' });
  }

  const key = artist.toLowerCase();

  // In-memory cache
  if (cache.has(key)) {
    return res.status(200).json(cache.get(key));
  }

  try {
    const url =
      `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar` +
      `&artist=${encodeURIComponent(artist)}` +
      `&api_key=${process.env.LASTFM_API_KEY}` +
      `&format=json&limit=10`;

    const response = await fetch(url);
    const data = await response.json();

    const result = data?.similarartists?.artist || [];

    cache.set(key, result);

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'Last.fm fetch failed' });
  }
}