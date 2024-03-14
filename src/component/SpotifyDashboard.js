import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate} from "react-router-dom";
import SpotifyPlaylist from "./SpotifyPlaylist";
import SpotifyRecommendationTracks from './SpotifyRecommendationTracks';
import SpotifyRecommendationArtists from './SpotifyRecommendationArtists';
import SpotifyTracks from './SpotifyTracks';

import '../css/SpotifyDashboard.css';


export default function SpotifyDashboard() {
  const location = useLocation();

  useEffect(() => {
    //Load recommendation tracks on load
    if (location.pathname === '/spotifydashboard') {
      window.location.href = '/spotifydashboard/recommendationtracks';
    }
  }, [location]);

  return (
    <div className='spotify-dashboard'>
      <nav>

          <ul className="spotify-dashboard__navbar">
       
            <li className="spotify-feature">
                <Link className={location.pathname === '/spotifydashboard/spotify' ? 'active' : ''} to="spotify">Top Tracks</Link>
            </li>

            <li className="spotify-feature">
                <Link className={location.pathname === '/spotifydashboard/recommendationtracks' ? 'active' : ''} to="recommendationtracks">Tracks Rec</Link>
            </li>

            <li className="spotify-feature">
                <Link className={location.pathname === '/spotifydashboard/recommendationartists' ? 'active' : ''} to="recommendationartists">Artists Rec</Link>
            </li>
            
          </ul>

      </nav>

      <div className="spotify-container">
        <Routes>

          <Route path="recommendationtracks" element={<SpotifyRecommendationTracks/>} />
          <Route path="recommendationartists" element={<SpotifyRecommendationArtists />} />
          <Route path="spotify" element={<SpotifyTracks />} />
           
        </Routes>
      </div>

    </div>
  );
}