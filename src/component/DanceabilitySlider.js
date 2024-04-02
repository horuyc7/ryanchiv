import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

export default function DanceabilitySlider({ onDanceabilitySelected }) {
    const [danceability, setDanceability] = useState();
  
    const handleDanceabilityChange = (event, newValue) => {

        setDanceability(newValue);

        onDanceabilitySelected(newValue);
    };
  
    return (
      <div>

        <Box sx={{ width: 160 }}>

            <Typography id="non-linear-slider" gutterBottom>
                Danceability: {danceability}
            </Typography>
            
            <Slider
            aria-label="energy"
            value={danceability}
            onChange={handleDanceabilityChange}
            color="#a2f0c0"
            step={.05}
            marks
            min={0.0}
            max={1.0}
            />

        </Box>
      </div>
    );
  }
