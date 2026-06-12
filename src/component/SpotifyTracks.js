import React, { useState, useEffect } from "react";
import "../css/SpotifyTracks.css";

// Generic Spotify API request
async function fetchWebApi(endpoint, method, accessToken) {
  const response = await fetch(`https://api.spotify.com/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}

async function getTopTracks(accessToken, timeRange, limit) {
  const endpoint = `v1/me/top/tracks?time_range=${timeRange}&limit=${
    limit || 10
  }`;

  const response = await fetchWebApi(
    endpoint,
    "GET",
    accessToken
  );

  return response.items;
}

export default function SpotifyTracks() {
  const [tracks, setTracks] = useState([]);

  const [timeRange, setTimeRange] = useState("short_term");
  const [limit, setLimit] = useState("");

  const [accessToken, setAccessToken] = useState(null);

  // Fetch access token on load
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch("/api/spotifyUserToken");
        const data = await response.json();

        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Token error:", error);
      }
    }

    fetchToken();
  }, []);

  const fetchTracks = async () => {
    try {
      const data = await getTopTracks(
        accessToken,
        timeRange,
        limit
      );

      setTracks(data);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  // Trigger track fetch
  const handleFetchClick = () => {
    if (timeRange && accessToken) {
      fetchTracks();
    }
  };

  return (
    <div className="spotify-tracks">
      {/* Filters */}
      <div className="spotify-tracks__controls">
        <span className="spotify-tracks__label">
          Terms:
        </span>

        <label className="spotify-tracks__option">
          <input
            type="radio"
            value="short_term"
            checked={timeRange === "short_term"}
            onChange={handleTimeRangeChange}
          />
          Short
        </label>

        <label className="spotify-tracks__option">
          <input
            type="radio"
            value="medium_term"
            checked={timeRange === "medium_term"}
            onChange={handleTimeRangeChange}
          />
          Medium
        </label>

        <label className="spotify-tracks__option">
          <input
            type="radio"
            value="long_term"
            checked={timeRange === "long_term"}
            onChange={handleTimeRangeChange}
          />
          Long
        </label>

        <input
          className="spotify-tracks__input"
          type="text"
          maxLength="2"
          placeholder="Enter limit (default=10)"
          value={limit}
          onChange={handleLimitChange}
        />

        <button
          className="spotify-tracks__button"
          onClick={handleFetchClick}
        >
          Get
        </button>
      </div>

      {/* Tracks */}
      <div className="spotify-tracks__list">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="spotify-tracks__item"
          >
            <p className="spotify-tracks__rank">
              {index + 1}
            </p>

            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="spotify-tracks__image"
                src={track.album.images[1].url}
                alt={track.name}
              />
            </a>

            <div className="spotify-tracks__details">
              <p className="spotify-tracks__track">{track.name}</p>
              <p className="spotify-tracks__artist">
                {track.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}