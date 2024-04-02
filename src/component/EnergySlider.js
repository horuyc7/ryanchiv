import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

export default function EnergySlider({ onEnergySelected }) {
    const [energy, setEnergy] = useState();
  
    const handleEnergyChange = (event, newValue) => {

        setEnergy(newValue);

        onEnergySelected(newValue);
    };
  
    return (
      <div>

        <Box sx={{ width: 160 }}>

            <Typography id="non-linear-slider" gutterBottom>
                Energy: {energy}
            </Typography>
            
            <Slider
            aria-label="energy"
            value={energy}
            onChange={handleEnergyChange}
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
