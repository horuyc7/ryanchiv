import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./component/Profile";
import Movies from "./component/Movies";
import Manga from "./component/Manga";
import Slide from "./component/Slide";
import Restaurants from './component/Restaurants';
import SpotifyDashboard from './component/SpotifyDashboard';
import Vinyl from './component/Vinyl';
import ImageClassifier from './component/ImageClassifier';

import './App.css';


const ExternalLink = ({ to, children }) => (

  <a href={to} target="_blank" rel="noopener noreferrer">

    {children}

  </a>

);


export default function App() {
  
  return (
    <Router>
      <div>
          <ul className="profilepic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', listStyleType: 'none', margin: 0, padding: 0, marginTop: '20px'}}>
            <Profile />
          </ul>
        

          <nav className="navbar">
            <ul className="navbar-nav ml-auto">

              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/spotifydashboard">Spotify</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/movies">Movies</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/travel">Travel</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/manga">Manga</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/restaurants">Restaurants</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/vinyl">Vinyl</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/imageclassifier">Image</Link>
              </li>

              <li className="nav-item">
                <ExternalLink className="nav-link" to="https://github.com/horuyc7/ryanchiv">Git</ExternalLink>
              </li>

            </ul>
          </nav>

          <div className="container">
            <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/travel" element={<Slide />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/manga" element={<Manga />} />
                <Route path="/spotifydashboard/*" element={<SpotifyDashboard />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/vinyl" element={<Vinyl />} />
                <Route path="/imageclassifier" element={<ImageClassifier />} />
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>

      </div>
    </Router>
  );
}