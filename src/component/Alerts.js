import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const iconMapping = {
    info: <InfoOutlinedIcon style={{ color: '#d6550e' }} />,
  };
  
export default function Alerts() {
  return (
    <Stack sx={{ width: '100%', marginBottom: '20px' }}>

        <Alert
        variant='outlined'
        severity="info"
        iconMapping={iconMapping}
        sx={{
            borderColor: '#d6550e',
            color: '#8be7ae',
            fontSize: '16px'
        }}
        >
        <div>Under Maintenance</div>
        </Alert>

    </Stack>
  );
}