import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom";
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

const ExternalLink = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

// Import all images from the './images' directory
const images = importAll(require.context('./images/', false, /\.(png|jpeg|JPG|JPEG|svg)$/));


export default function App() {
  
  return (
    <Router>
    <div>
        <ul className="profilepic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', listStyleType: 'none', margin: 0, padding: 0, marginTop: '20px', marginBottom: '20px'}}>
          <Profile />
        </ul>
    

      <nav className="navbar">
        
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
          <li className="nav-item">
            <ExternalLink className="nav-link" to="https://github.com/horuyc7/ryanchiv" style={{ marginRight: '10px' }}>Git</ExternalLink>
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