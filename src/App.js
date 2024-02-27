import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./component/Profile";
import Travel from "./component/Travel";
import Movies from "./component/Movies";
import Manga from "./component/Manga";
import Spotify from "./component/Spotify";
import './App.css';


function importAll(r) {
  return r.keys().map(r);
}

// Import all images from the './images' directory
const images = importAll(require.context('./images/', false, /\.(png|jpe?g|JPG|svg)$/));


export default function App() {
  
  return (
    <Router>
    <div>
      <nav className="navbar">
        <div className="profile-container" style={{marginBottom: '30px' }}>
          <Link className="profilepic" to="/profile">
            <Profile />
          </Link>
        </div>
          <ul className="navbar-nav ml-auto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', listStyleType: 'none', margin: 0, padding: 0, marginBottom: '30px'}}>
          <li className="nav-item">
            <Link className="nav-link" to="/" style={{ marginRight: '10px'}}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/spotify" style={{ marginRight: '10px' }} >Spotify</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/movies" style={{ marginRight: '10px' }} >Movies</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/travel" style={{ marginRight: '10px' }} >Travel</Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/manga" style={{ marginRight: '10px' }} >Manga</Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/travel" element={<Travel images={images} />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/manga" element={<Manga />} />
            <Route path="/spotify" element={<Spotify />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}