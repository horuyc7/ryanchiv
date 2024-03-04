// Import necessary libraries
const AXIOS = require('axios');
let tokenExpirationTime = null;
let accessToken = null;

//Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,

// Function to fetch access token from Spotify API
async function fetchAccessToken() {
    try {
        // Make POST request to Spotify API token endpoint
        const response = await AXIOS.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'authorization_code',
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            },
        });

          tokenExpirationTime = Date.now() + (response.data.expires_in * 1000); // Convert expiration time to milliseconds

          accessToken = response.data.access_token;
          //return response.data.access_token;
  
    } catch (error) {
        console.error('Error fetching access token from Spotify API:', error);
        throw new Error('Failed to fetch access token from Spotify API');
    }
}

function isTokenExpired() {
    return tokenExpirationTime === null || tokenExpirationTime < Date.now();
}

// Export the serverless function
module.exports = async (req, res) => {
    try {
        // Fetch access token from Spotify API
         if (isTokenExpired() || accessToken === null) {
            await fetchAccessToken();
        }

        // Return the access token as JSON response
        res.status(200).json({ access_token: accessToken });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Failed to fetch access token from Spotify API' });
    }
};