import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard";
import Movies from "./component/Movies";
import Manga from "./component/Manga";
import Travel from "./component/Travel";
import Restaurants from './component/Restaurants';
import SpotifyDashboard from './component/SpotifyDashboard';
import Vinyl from './component/Vinyl';
import ImageClassifier from './component/ImageClassifier';
import TemporaryDrawer from './component/TemporaryDrawer'; 
import MediaPipe from './component/MediaPipe';
import Hobbies from './component/Hobbies';

import './App.css';
import FeaturesCard from './component/FeaturesCard';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import { colors } from '@mui/material';
import { Save } from '@mui/icons-material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

const actions = [
  { icon: <DescriptionIcon />, name: 'Resume', action: () => handleDownloadPDF()},
  { icon: <ShareIcon />, name: 'Share' },
  //{ icon: <PrintIcon />, name: 'Print' },
 // { icon: <SaveIcon />, name: 'Save'},
];

const pdfUrl = `${process.env.PUBLIC_URL}/RyanChivResume.pdf`;

function handleDownloadPDF() {
  // Create a link element


  const link = document.createElement('a');
  // Set the href to the URL of your PDF file
  link.href = pdfUrl;
  // Set the download attribute to the desired file name
  link.download = 'RyanChivResume.pdf';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const Theme = createTheme({
  palette: {
    primary: {
      main: '#d6550e',
      
    },

    secondary: {
      main: '#8be4a9',
      
    },


    mode: 'dark',

    
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
            bgcolor: '#8be4a9',
            '&:hover': {
              bgcolor: '#79c992',
            },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action} // Attach the action handler
          />
        ))}
      </SpeedDial>
    </Slide>
  );
}

export default function App() {
  
  return (
    <Router>
      <div>
          <div className='drawer'>
                <TemporaryDrawer /> {/* Render the TemporaryDrawer component */}
          </div>
    
          <CustomSpeedDial />
        

          <div className="container">
            <Routes>

                <Route path="/" element={<Dashboard />} />
                <Route path="/hobbies" element={<Hobbies />} />
                <Route path="/features" element={<FeaturesCard />} />
                <Route path="/travel" element={<Travel />} />
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