import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

//sx={{ marginTop: '-10px', marginLeft: '-40px', width: '110%'}}

export default function LoadingCircle() {
  return (
    <Stack sx={{alignItems: 'center', marginLeft: '-25px', marginTop: '20px'}}>
      <CircularProgress color="inherit" size={30} />
    </Stack>
  );
}