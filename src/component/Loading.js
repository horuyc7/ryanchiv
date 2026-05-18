import * as React from 'react';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
    return (
        <Stack sx={{ marginTop: '-22px', marginLeft: '-40px', width: '120%'}}>
            <LinearProgress color="inherit"/>
        </Stack>

    );
  }