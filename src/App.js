import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

import Dashboard from "./Dashboard";
import Movies from "./component/Movies";
import Restaurants from './component/Restaurants';
import SpotifyDashboard from './component/SpotifyDashboard';
import ImageClassifier from './component/ImageClassifier';
import TemporaryDrawer from './component/TemporaryDrawer'; 
import MediaPipe from './component/MediaPipe';
import Gallery from "./component/Gallery";
import Books from './component/Books';
import FeaturesCard from './component/FeaturesCard';

import './App.css';

import { createTheme } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';


const actions = [
  { icon: <DescriptionIcon />, name: ''},
  { icon: <ShareIcon />, name: '' },
];

const pdfUrl = `${process.env.PUBLIC_URL}/RyanChivResume.pdf`;

function handleDownloadPDF() {

  const link = document.createElement('a');

  link.href = pdfUrl;

  link.download = 'RyanChivResume.pdf';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Theme = createTheme({
  palette: {
    primary: { main: "#d6550e" },
    secondary: { main: "#8be4a9" },
    mode: "dark",
  },
});

const ExternalLink = ({ to, children }) => (

  <a href={to} target="_blank" rel="noopener noreferrer">

    {children}

  </a>

);

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function CustomSpeedDial(props) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Slide direction="up" in={scrollDirection === 'up'}>
      <SpeedDial
        ariaLabel="SpeedDial example"
        sx={{ position: 'fixed', bottom: 14, right: 14 }}
        icon={<SpeedDialIcon />}
        FabProps={{
          sx: {
            bgcolor: '#bbf3d0',
            '&:hover': {
              bgcolor: '#9aefba',
            },
            scale: .8,
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Slide>
  );
}

export default function App() {

  const location = useLocation();

  const hideSpeedDial = location.pathname === "/gallery";

  return (
      <div>
          <Analytics mode="production" />

          <div className='drawer'>
            <TemporaryDrawer />
          </div>
    
          {!hideSpeedDial && <CustomSpeedDial />}

          <div className="container">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/features" element={<FeaturesCard />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/books/" element={<Books />} />
                <Route path="/spotify/*" element={<SpotifyDashboard />} />
                <Route path="/food" element={<Restaurants />} />
                <Route path="/image" element={<ImageClassifier />} />
                <Route path="/object" element={<MediaPipe />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

      </div>
  );
}