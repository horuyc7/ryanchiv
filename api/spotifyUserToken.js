const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!refresh_token) {
      return res.status(400).json({
        error: 'Missing SPOTIFY_REFRESH_TOKEN in env',
      });
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        },
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ':' +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.status(200).json({
      access_token: response.data.access_token,
    });
  } catch (error) {
    console.error(
      'Spotify user token error:',
      error?.response?.data || error.message
    );

    return res.status(500).json({
      error: 'Failed to refresh Spotify user token',
    });
  }
};