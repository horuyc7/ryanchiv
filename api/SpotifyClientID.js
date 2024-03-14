// Fetch Spotify ID from Vercel Env Var
export function GET(request) {

  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  return new Response(JSON.stringify({ clientId: spotifyClientId }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

}