// Import necessary libraries
const axios = require('axios');
let tokenExpirationTime = null;
let accessToken = null;
const CLIENT_ID = '6198fcf6f4eb4eda9e9bca8527177fd4';
const REDIRECT_URI = 'https://ryanchiv.vercel.app'; // This should match the redirect URI configured in your Spotify Developer Dashboard
const SCOPES = 'user-top-read'; // The scope(s) required for accessing user's top tracks

export async function authorizeUser() {
    const authorizeEndpoint = 'https://accounts.spotify.com/authorize';
    const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
    });

    window.location.href = `${authorizeEndpoint}?${queryParams}`;
}

async function fetchAccessToken(code) {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const clientId = CLIENT_ID;
    const clientSecret = '5f3e5221e42d4ca695c2c1be5910747f';

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        })
    });

    const data = await response.json();
    accessToken = data.access_token;
}

function isTokenExpired() {
    return tokenExpirationTime === null || tokenExpirationTime < Date.now();
}


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
