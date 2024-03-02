export function GET(request) {
    return new Response(process.env.SPOTIFY_CLIENT_ID);
  }