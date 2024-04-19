import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import Movies from "./component/Movies";
import Manga from "./component/Manga";
import Slide from "./component/Slide";
import Restaurants from './component/Restaurants';
import SpotifyDashboard from './component/SpotifyDashboard';
import Vinyl from './component/Vinyl';
import ImageClassifier from './component/ImageClassifier';
import TemporaryDrawer from './component/TemporaryDrawer'; 
import MediaPipe from './component/MediaPipe';

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
          <div className='drawer'>
                <TemporaryDrawer /> {/* Render the TemporaryDrawer component */}
          </div>
        

          <div className="container">
            <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/travel" element={<Slide />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/manga" element={<Manga />} />
                <Route path="/spotify/*" element={<SpotifyDashboard />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/vinyl" element={<Vinyl />} />
                <Route path="/image" element={<ImageClassifier />} />
                <Route path="/object" element={<MediaPipe />} />
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </div>

      </div>
    </Router>
  );
}