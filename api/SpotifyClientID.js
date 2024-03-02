export function GET(request) {
    return new Response(`Hello from ${process.env.SPOTIFY_CLIENT_ID}`);
  }