import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate} from "react-router-dom";
import SpotifyRecommendationTracks from './SpotifyRecommendationTracks';
import SpotifyRecommendationArtists from './SpotifyRecommendationArtists';
//import SpotifyTracks from './SpotifyTracks';
import Spotify from './Spotify';

import '../css/SpotifyDashboard.css';


export default function SpotifyDashboard() {
  const location = useLocation();

  useEffect(() => {
    //Load recommendation tracks on load
    if (location.pathname === '/spotify') {
      window.location.href = '/spotify/recommendationtracks';
    }
  }, [location]);

  return (
    <div className='spotify-dashboard'>
      <nav>

          <ul className="spotify-dashboard__navbar">
       
            <li className="spotify-feature">
                <Link className={location.pathname === '/spotify/spotifytracks' ? 'active' : ''} to="spotifytracks">Top Tracks</Link>
            </li>

            <li className="spotify-feature">
                <Link className={location.pathname === '/spotify/recommendationtracks' ? 'active' : ''} to="recommendationtracks">Tracks Rec</Link>
            </li>

            <li className="spotify-feature">
                <Link className={location.pathname === '/spotify/recommendationartists' ? 'active' : ''} to="recommendationartists">Artists Rec</Link>
            </li>
            
          </ul>

      </nav>

      <div className="spotify-container">
        <Routes>

          <Route path="recommendationtracks" element={<SpotifyRecommendationTracks/>} />
          <Route path="recommendationartists" element={<SpotifyRecommendationArtists />} />
          <Route path="spotify" element={<Spotify />} />
           
        </Routes>
      </div>

    </div>
  );
}