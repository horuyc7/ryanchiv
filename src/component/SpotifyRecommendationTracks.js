import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';
import LoadingCircle from './LoadingCircle';

import '../css/SpotifyRecommendationTracks.css';

async function fetchWebApi(endpoint, method, accessToken) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });
  return await res.json();
}

export default function SpotifyRecommendationTracks() {

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('input');
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [recommendation, setRecommendation] = useState({ tracks: [] });

  const [accessToken, setAccessToken] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [artistIds, setArtistIds] = useState([]);

  // Get Spotify token
  useEffect(() => {
    async function fetchAndSetToken() {
      try {
        const token = await FetchSpotifyToken();
        setAccessToken(token);
      } catch (error) {
        console.error('Token error:', error);
      }
    }
    fetchAndSetToken();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add artist
  const handleInputClick = async () => {

    setLoading(true);
    setIsError(false);

    if (!inputValue && artistIds.length === 0) {
      setIsError(true);
      setErrorText('No Input');
      setLoading(false);
      return;
    }

    try {

      const response = await fetchWebApi(
        `v1/search?q=${encodeURIComponent(inputValue)}&type=artist&limit=5`,
        'GET',
        accessToken
      );

      const artist = response?.artists?.items?.[0];

      if (!artist) {
        setIsError(true);
        setErrorText('Artist not found');
        setLoading(false);
        return;
      }

      if (artistIds.some(a => a.id === artist.id)) {
        setIsError(true);
        setErrorText('Artist already added');
      } else {
        setArtistIds(prev => [...prev, artist]);
      }

      setInputValue('');

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setActiveSection('input');
    }
  };

  // Get recommendations
  const handleGetClick = async () => {

    setIsError(false);
    setLoading(true);
    setRecommendation({ tracks: [] });

    if (artistIds.length === 0) {
      setIsError(true);
      setErrorText('No artist(s) added');
      setLoading(false);
      return;
    }

    try {

      let allTracks = [];
      const seenArtists = new Set();

      for (const artist of artistIds) {

        const res = await fetch(
          `/api/lastfm?artist=${encodeURIComponent(artist.name)}`
        );

        const similarArtists = await res.json();

        if (!Array.isArray(similarArtists)) continue;

        for (const similar of similarArtists.slice(0, 5)) {

          if (seenArtists.has(similar.name)) continue;
          seenArtists.add(similar.name);

          const spotifyRes = await fetchWebApi(
            `v1/search?q=${encodeURIComponent(similar.name)}&type=track&limit=2`,
            'GET',
            accessToken
          );

          const tracks = spotifyRes?.tracks?.items || [];
          allTracks.push(...tracks);
        }
      }

      // remove duplicate tracks
      const uniqueTracks = allTracks.filter(
        (track, index, self) =>
          index === self.findIndex(t => t.id === track.id)
      );

      setRecommendation({
        tracks: uniqueTracks.slice(0, 10),
      });

      setActiveSection('get');

    } catch (error) {
      console.error(error);
      setIsError(true);
      setErrorText('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='spotify-recommendation-tracks'>

      {/* INPUT */}
      <div className="spotify-recommendation-tracks__input-container">

        <input
          className='textbox'
          type="text"
          maxLength="30"
          placeholder="Input Artists (max 5)"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button className="input-button" onClick={handleInputClick}>
          Input
        </button>

      </div>

      {/* GET BUTTON */}
      <div className="spotify-recommendation-tracks__get-container">
        <button className="getrec-button" onClick={handleGetClick}>
          Get Rec
        </button>
      </div>

      {/* ERROR */}
      {isError && <p className='error'>{errorText}</p>}

      {/* LOADING */}
      {loading ? (
        <div className='loading'>
          <LoadingCircle />
        </div>
      ) : (
        <div>

          {/* INPUT ARTISTS */}
          {activeSection === 'input' && (
            <div className="spotify-recommendation-tracks__artists">

              {artistIds.map((a) => (
                <div key={a.id} className='artist-container'>

                  <a href={a.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <img
                      src={a.images?.[0]?.url || '/fallback.jpg'}
                      alt={a.name}
                    />
                  </a>

                  <div className='artist-detail'>
                    <p>{a.name}</p>
                  </div>

                </div>
              ))}

            </div>
          )}

          {/* TRACKS */}
          {activeSection === 'get' && (
            <div className="spotify-recommendation-tracks__tracks">

              {recommendation?.tracks?.map((t) => (

                <div key={t.id} className='track-container'>

                  <a href={t.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <img
                      src={t.album?.images?.[0]?.url || '/fallback.jpg'}
                      alt={t.name}
                    />
                  </a>

                  <div className='track-detail'>
                    <p>{t.name}</p>
                    <p>{t.artists?.[0]?.name}</p>
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