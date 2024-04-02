import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

export default function PopularitySlider({ onPopularitySelected }) {
    const [popularity, setPopularity] = useState();
  
    const handlePopularityChange = (event, newValue) => {

      setPopularity(newValue);

      onPopularitySelected(newValue);
    };
  
    return (
      <div>

        <Box sx={{ width: 160 }}>

            <Typography id="non-linear-slider" gutterBottom>
                Popularity: {popularity}
            </Typography>
            
            <Slider
            aria-label="popularity"
            value={popularity}
            onChange={handlePopularityChange}
            color="#a2f0c0"
            step={5}
            marks
            min={0}
            max={100}
            />

        </Box>
      </div>
    );
  }
