import React, { useState, useEffect } from "react";
import FetchSpotifyToken from "./FetchSpotifyToken";
import LoadingCircle from "./LoadingCircle";

import "../css/SpotifyRecommendationTracks.css";

// Generic Spotify Web API helper
async function fetchWebApi(endpoint, method, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/${endpoint}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}

export default function SpotifyRecommendationTracks() {
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] =
    useState("input");

  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [recommendation, setRecommendation] =
    useState({ tracks: [] });

  const [accessToken, setAccessToken] =
    useState("");

  const [inputValue, setInputValue] =
    useState("");

  const [artistIds, setArtistIds] =
    useState([]);

  useEffect(() => {
    async function fetchToken() {
      try {
        const token =
          await FetchSpotifyToken();

        setAccessToken(token);
      } catch (error) {
        console.error(
          "Token error:",
          error
        );
      }
    }

    fetchToken();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Add artist to selected artist list.
  const handleInputClick = async () => {
    setLoading(true);
    setIsError(false);

    if (!inputValue && artistIds.length === 0) {
      setIsError(true);
      setErrorText("No Input");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWebApi(
        `v1/search?q=${encodeURIComponent(
          inputValue
        )}&type=artist&limit=5`,
        "GET",
        accessToken
      );

      const artist =
        response?.artists?.items?.[0];

      if (!artist) {
        setIsError(true);
        setErrorText("Artist not found");
        return;
      }

      const alreadyExists =
        artistIds.some(
          (item) => item.id === artist.id
        );

      if (alreadyExists) {
        setIsError(true);
        setErrorText(
          "Artist already added"
        );
      } else {
        setArtistIds((prev) => [
          ...prev,
          artist,
        ]);
      }

      setInputValue("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setActiveSection("input");
    }
  };

  const handleGetClick = async () => {
    setLoading(true);
    setIsError(false);

    setRecommendation({
      tracks: [],
    });

    if (artistIds.length === 0) {
      setIsError(true);
      setErrorText(
        "No artist(s) added"
      );
      setLoading(false);
      return;
    }

    try {
      const allTracks = [];
      const seenArtists =
        new Set();

      for (const artist of artistIds) {
        const response = await fetch(
          `/api/lastfm?artist=${encodeURIComponent(
            artist.name
          )}`
        );

        const similarArtists =
          await response.json();

        if (
          !Array.isArray(similarArtists)
        ) {
          continue;
        }

        for (const similar of similarArtists.slice(
          0,
          5
        )) {
          if (
            seenArtists.has(
              similar.name
            )
          ) {
            continue;
          }

          seenArtists.add(
            similar.name
          );

          const spotifyResponse =
            await fetchWebApi(
              `v1/search?q=${encodeURIComponent(
                similar.name
              )}&type=track&limit=2`,
              "GET",
              accessToken
            );

          allTracks.push(
            ...(spotifyResponse?.tracks
              ?.items || [])
          );
        }
      }

      const uniqueTracks =
        allTracks.filter(
          (track, index, self) =>
            index ===
            self.findIndex(
              (item) =>
                item.id === track.id
            )
        );

      setRecommendation({
        tracks: uniqueTracks.slice(
          0,
          10
        ),
      });

      setActiveSection("get");
    } catch (error) {
      console.error(error);

      setIsError(true);
      setErrorText(
        "Failed to fetch recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spotify-recommendation-tracks">
      {/* Controls */}
      <div className="spotify-recommendation-tracks__controls">
        <input
          className="spotify-recommendation-tracks__input"
          type="text"
          maxLength="30"
          placeholder="Input Artists (max 5)"
          value={inputValue}
          onChange={handleInputChange}
        />

        <button
          className="spotify-recommendation-tracks__input-button"
          onClick={handleInputClick}
        >
          Input
        </button>
      </div>

      <div className="spotify-recommendation-tracks__controls">
        <button
          className="spotify-recommendation-tracks__get-button"
          onClick={handleGetClick}
        >
          Get Rec
        </button>
      </div>

      {isError && (
        <p className="spotify-recommendation-tracks__error">
          {errorText}
        </p>
      )}

      {loading ? (
        <div className="spotify-recommendation-tracks__loading">
          <LoadingCircle />
        </div>
      ) : (
        <>
          {/* Inputed artists */}
          {activeSection === "input" && (
            <div className="spotify-recommendation-tracks__artists">
              {artistIds.map(
                (artist) => (
                  <div
                    key={artist.id}
                    className="spotify-recommendation-tracks__artist"
                  >
                    <a
                      href={
                        artist
                          .external_urls
                          .spotify
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="spotify-recommendation-tracks__artist-image"
                        src={
                          artist.images?.[0]
                            ?.url ||
                          "/fallback.jpg"
                        }
                        alt={
                          artist.name
                        }
                      />
                    </a>

                    <div className="spotify-recommendation-tracks__artist-details">
                      <p className="spotify-recommendation-tracks__artist-name">
                        {artist.name}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Recommendations */}
          {activeSection === "get" && (
            <div className="spotify-recommendation-tracks__tracks">
              {recommendation?.tracks?.map(
                (track) => (
                  <div
                    key={track.id}
                    className="spotify-recommendation-tracks__track"
                  >
                    <a
                      href={
                        track
                          .external_urls
                          .spotify
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="spotify-recommendation-tracks__track-image"
                        src={
                          track.album
                            ?.images?.[0]
                            ?.url ||
                          "/fallback.jpg"
                        }
                        alt={
                          track.name
                        }
                      />
                    </a>

                    <div className="spotify-recommendation-tracks__track-details">
                      <p className="spotify-recommendation-tracks__track-name">
                        {track.name}
                      </p>

                      <p className="spotify-recommendation-tracks__track-artist">
                        {
                          track
                            .artists?.[0]
                            ?.name
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}