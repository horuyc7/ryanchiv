import React, { useState } from 'react';
import { Autocomplete, TextField, ThemeProvider, createTheme } from '@mui/material';


const GENRES = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
  ];


const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Set the mode to dark
    primary: {
        main: '#8be7ae', // Customize the primary color
    },
    text: {
        primary: '#ffffff', // Customize the text color
    },
  },
});

  export default function Genres({ onGenresSelected }) {
    const [selectedGenres, setSelectedGenres] = useState([]);
  
    const handleGenresChange = (event, newValue) => {
      
      // Limit the selected genres to a maximum of 5
      const limitedValue = newValue.slice(0, 5);

      setSelectedGenres(newValue);
      // Call the parent component function with the selected genres
      onGenresSelected(newValue);
    };
  
    return (
      <div>
        <ThemeProvider theme={darkTheme}>


          <Autocomplete
            multiple
            size="small"
            value={selectedGenres}
            onChange={handleGenresChange}
            id="controllable-states-demo"
            options={GENRES}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Genres"/>}
          />


        </ThemeProvider>
        
      </div>
    );
  }

