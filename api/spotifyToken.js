// Import necessary libraries
const axios = require('axios');

// Function to fetch access token from Spotify API
async function fetchAccessToken() {
    try {
        // Make POST request to Spotify API token endpoint
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'client_credentials',
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            },
        });

        // Extract and return the access token from the Spotify API response
        return response.data.access_token;
        
    } catch (error) {
        console.error('Error fetching access token from Spotify API:', error);
        throw new Error('Failed to fetch access token from Spotify API');
    }
}

// Export the serverless function
module.exports = async (req, res) => {
    try {
        // Fetch access token from Spotify API
        const accessToken = await fetchAccessToken();

        // Return the access token as JSON response
        res.status(200).json({ access_token: accessToken });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Failed to fetch access token from Spotify API' });
    }
};