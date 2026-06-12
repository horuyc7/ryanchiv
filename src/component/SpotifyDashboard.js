import React, { useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  Navigate,
} from "react-router-dom";

import SpotifyRecommendationTracks from "./SpotifyRecommendationTracks";
import SpotifyRecommendationArtists from "./SpotifyRecommendationArtists";
import SpotifyTracks from "./SpotifyTracks";

import "../css/SpotifyDashboard.css";

export default function SpotifyDashboard() {
  const location = useLocation();

  if (location.pathname === "/spotify") {
    return <Navigate to="/spotify/recommendationtracks" replace />;
  }

  return (
    <div className="spotify-dashboard">

      <nav className="spotify-dashboard__nav">

        <ul className="spotify-dashboard__nav-list">

          <li className="spotify-dashboard__nav-item">
            <NavLink
              to="spotifytracks"
              className={({ isActive }) =>
                isActive
                  ? "spotify-dashboard__nav-link spotify-dashboard__nav-link--active"
                  : "spotify-dashboard__nav-link"
              }
            >
              Top Tracks
            </NavLink>
          </li>

          <li className="spotify-dashboard__nav-item">
            <NavLink
              to="recommendationtracks"
              className={({ isActive }) =>
                isActive
                  ? "spotify-dashboard__nav-link spotify-dashboard__nav-link--active"
                  : "spotify-dashboard__nav-link"
              }
            >
              Tracks Rec
            </NavLink>
          </li>

          <li className="spotify-dashboard__nav-item">
            <NavLink
              to="recommendationartists"
              className={({ isActive }) =>
                isActive
                  ? "spotify-dashboard__nav-link spotify-dashboard__nav-link--active"
                  : "spotify-dashboard__nav-link"
              }
            >
              Artists Rec
            </NavLink>
          </li>

        </ul>
      </nav>

      <div className="spotify-dashboard__content">
        <Routes>

          <Route
            path="recommendationtracks"
            element={<SpotifyRecommendationTracks />}
          />

          <Route
            path="recommendationartists"
            element={<SpotifyRecommendationArtists />}
          />

          <Route
            path="spotifytracks"
            element={<SpotifyTracks />}
          />

        </Routes>
      </div>

    </div>
  );
}