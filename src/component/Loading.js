import * as React from 'react';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
    return (
        <Stack sx={{ marginTop: '-10px', marginLeft: '-22px', width: '110%'}}>
            <LinearProgress color="inherit" sx={{zIndex: '1200'}}/>
        </Stack>

    );
  }