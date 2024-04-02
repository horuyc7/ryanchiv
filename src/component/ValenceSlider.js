import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

export default function ValenceSlider({ onValenceSelected }) {
    const [valence, setValence] = useState();
  
    const handleValenceChange = (event, newValue) => {

        setValence(newValue);

        onValenceSelected(newValue);
    };
  
    return (
      <div>

        <Box sx={{ width: 160 }}>

            <Typography id="non-linear-slider" gutterBottom>
                Valence: {valence}
            </Typography>
            
            <Slider
            aria-label="valence"
            value={valence}
            onChange={handleValenceChange}
            color="#a2f0c0"
            shiftStep={30}
            step={.05}
            marks
            min={0.0}
            max={1.0}
            />

        </Box>
      </div>
    );
  }
