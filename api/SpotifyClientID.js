export function GET(request) {

  const { SPOTIFY_CLIENT_ID } = process.env;
  res.status(200).json({ clientId: SPOTIFY_CLIENT_ID });

  }