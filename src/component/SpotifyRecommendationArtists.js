import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';
import LoadingCircle from './LoadingCircle';

import '../css/SpotifyRecommendationArtists.css';

async function fetchLastFm(url) {
  const res = await fetch(url);
  return await res.json();
}

async function fetchWebApi(endpoint, method, accessToken) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });
  return await res.json();
}

export default function SpotifyRecommendation() {

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const [inputValue, setInputValue] = useState('');

  // single artist (main)
  const [artist, setArtist] = useState(null);

  // related artists list
  const [relatedArtists, setRelatedArtists] = useState([]);

  const [accessToken, setAccessToken] = useState('');

  // fetch token
  useEffect(() => {
    async function fetchAndSetToken() {
      try {
        const token = await FetchSpotifyToken();
        setAccessToken(token);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAndSetToken();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGetClick = async () => {

    if (!inputValue) return;

    setLoading(true);

    try {

      // 1. Spotify search main artist
      const searchRes = await fetchWebApi(
        `v1/search?q=${encodeURIComponent(inputValue)}&type=artist&limit=1`,
        'GET',
        accessToken
      );

      const mainArtist = searchRes?.artists?.items?.[0];

      if (!mainArtist) {
        setLoading(false);
        return;
      }

      // 2. Last.fm similar artists
      const res = await fetch(`/api/lastfm?artist=${encodeURIComponent(mainArtist.name)}`);
      const similar = await res.json();

      if (!Array.isArray(similar)) {
        throw new Error('Invalid Last.fm response');
      }

      // 3. Convert to Spotify artists
      const seen = new Set();
      const spotifyList = [];

      for (const a of similar) {

        if (seen.has(a.name)) continue;
        seen.add(a.name);

        const spotifyRes = await fetchWebApi(
          `v1/search?q=${encodeURIComponent(a.name)}&type=artist&limit=1`,
          'GET',
          accessToken
        );

        const found = spotifyRes?.artists?.items?.[0];

        if (found) spotifyList.push(found);

        if (spotifyList.length >= 8) break; // limit UI load
      }

      setArtist(mainArtist);
      setRelatedArtists(spotifyList);
      setInputValue('');
      setActiveSection('get');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='spotify-recommendation-artists'>

      <div className="spotify-recommendation-artists__input-container">

        <input
          className='textbox'
          type="text"
          maxLength="30"
          placeholder="Input Artist"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button className="get-button" onClick={handleGetClick}>
          Get
        </button>

      </div>

      {loading ? (
        <div className='loading'>
          <LoadingCircle />
        </div>
      ) : (
        <div>

          {activeSection === 'get' && artist && (

            <div className="spotify-recommendation-artists__artists">

              {/* MAIN ARTIST */}
              <div className='artist-container'>

                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={artist.images?.[0]?.url || '/fallback.jpg'}
                    alt={artist.name}
                  />
                </a>

                <div className='artist-detail'>
                  <p className='name'>{artist.name}</p>
                </div>

              </div>

              {/* RELATED ARTISTS */}
              {relatedArtists?.map((a, index) => (
                <div key={index} className='artists-container'>

                  <a
                    href={a.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={a.images?.[0]?.url || '/fallback.jpg'}
                      alt={a.name}
                    />
                  </a>

                  <div className='artists-detail'>
                    <p className='name'>{a.name}</p>
                  </div>

                </div>
              ))}

            </div>

          )}

        </div>
      )}

    </div>
  );
}