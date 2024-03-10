import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import SpotifyPlaylist from "./SpotifyPlaylist";
import SpotifyRecommendation from './SpotifyRecommendation';
import Spotify from './Spotify';
import SpotifyRecommendationArtists from './SpotifyRecommendationArtists';
import './SpotifyDashboard.css';


export default function SpotifyDashboard() {
  
  return (
    <div>
      <nav className="spotify-navbar">
          <ul className="spotify-navbar-nav ml-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', listStyleType: 'none', margin: 0, padding: 0, marginBottom: '30px'}}>
       
            <li className="spotify-item">
                <Link className="nav-link" to="spotify">Top Tracks</Link>
            </li>

            <li className="spotify-item">
                <Link className="nav-link" to="recommendationtracks">Tracks Recommendation</Link>
            </li>

            <li className="spotify-item">
                <Link className="nav-link" to="recommendationartists">Artists Recommendation</Link>
            </li>

            <li className="spotify-item">
                <Link className="nav-link" to="playlist">Playlist</Link>
            </li>
            
          </ul>
      </nav>
      <div className="container">
        <Routes>

                  <Route path="recommendationtracks" element={<SpotifyRecommendation/>} />
                  <Route path="recommendationartists" element={<SpotifyRecommendationArtists />} />
                  <Route path="playlist" element={<SpotifyPlaylist />} />
                  <Route path="spotify" element={<Spotify />} />
           
        </Routes>
      </div>
    </div>
  );
}