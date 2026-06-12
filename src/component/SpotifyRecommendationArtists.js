import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';
import LoadingCircle from './LoadingCircle';

import '../css/SpotifyRecommendationArtists.css';

async function fetchWebApi(endpoint, method, accessToken) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });

  return await res.json();
}

export default function SpotifyRecommendationArtists() {

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const [inputValue, setInputValue] = useState('');

  const [mainArtist, setMainArtist] = useState(null);

  const [relatedArtists, setRelatedArtists] = useState([]);

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    async function fetchToken() {
      try {
        const token = await FetchSpotifyToken();
        setAccessToken(token);
      } catch (err) {
        console.error('Token fetch error:', err);
      }
    }

    fetchToken();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGetClick = async () => {

    if (!inputValue) return;

    setLoading(true);

    try {

      // Get inputted artist from spotify
      const searchRes = await fetchWebApi(
        `v1/search?q=${encodeURIComponent(inputValue)}&type=artist&limit=1`,
        'GET',
        accessToken
      );

      const foundMainArtist = searchRes?.artists?.items?.[0];

      if (!foundMainArtist) {
        setLoading(false);
        return;
      }

      // Get recommended artist from lastfm
      const lastFmRes = await fetch(`/api/lastfm?artist=${encodeURIComponent(foundMainArtist.name)}`);
      const similarArtists = await lastFmRes.json();

      if (!Array.isArray(similarArtists)) {
        throw new Error('Invalid Last.fm response');
      }

      // Map to spotify artists
      const seen = new Set();
      const spotifyArtists = [];

      for (const artist of similarArtists) {

        if (seen.has(artist.name)) continue;
        seen.add(artist.name);

        const spotifyRes = await fetchWebApi(
          `v1/search?q=${encodeURIComponent(artist.name)}&type=artist&limit=1`,
          'GET',
          accessToken
        );

        const spotifyArtist = spotifyRes?.artists?.items?.[0];

        if (spotifyArtist) spotifyArtists.push(spotifyArtist);

        // limit UI load
        if (spotifyArtists.length >= 8) break;
      }

      setMainArtist(foundMainArtist);
      setRelatedArtists(spotifyArtists);
      setInputValue('');
      setActiveSection('results');

    } catch (err) {
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spotify-recommendation-artists">

      {/* Controls */}
      <div className="spotify-recommendation-artists__input-container">

        <input
          className="spotify-recommendation-artists__input"
          type="text"
          maxLength="30"
          placeholder="Input Artist"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button
          className="spotify-recommendation-artists__button"
          onClick={handleGetClick}
        >
          Get
        </button>

      </div>

      {loading ? (
        <div className="spotify-recommendation-artists__loading">
          <LoadingCircle />
        </div>
      ) : (
        <div>

          {/* Inputted artist */}
          {activeSection === 'results' && mainArtist && (

            <div className="spotify-recommendation-artists__list">

              <div className="spotify-recommendation-artists__artist">

                <a
                  href={mainArtist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="spotify-recommendation-artists__image"
                    src={mainArtist.images?.[0]?.url || '/fallback.jpg'}
                    alt={mainArtist.name}
                  />
                </a>

                <div className="spotify-recommendation-artists__name">
                  <p>{mainArtist.name}</p>
                </div>

              </div>

              {/* Recommendations */}
              {relatedArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="spotify-recommendation-artists__items"
                >

                  <a
                    href={artist.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="spotify-recommendation-artists__image"
                      src={artist.images?.[0]?.url || '/fallback.jpg'}
                      alt={artist.name}
                    />
                  </a>

                  <div className="spotify-recommendation-artists__name">
                    <p>{artist.name}</p>
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