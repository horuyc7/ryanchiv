export default async function FetchSpotifyToken() {
    const response = await fetch('/api/spotifyTokenUnauthorize');

    const data = await response.json();

    return data.access_token;
}