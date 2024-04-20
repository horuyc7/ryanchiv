import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheatersIcon from '@mui/icons-material/Theaters';
import MangaIcon from '@mui/icons-material/MenuBook'; // Import the MangaIcon
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';
import RestaurantIcon from '@mui/icons-material/Restaurant'; // Import the RestaurantIcon
import AlbumIcon from '@mui/icons-material/Album';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ImageIcon from '@mui/icons-material/Image';

import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {green} from '@mui/material/colors';

import SvgIcon from '@mui/material/SvgIcon';
import { DarkMode } from '@mui/icons-material';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}



const darkTheme = createTheme({
  palette: {
    primary: {
        main: '#d6550e',
        
      },
    mode: 'dark',
  },
});

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

const iconMap = {
    'Spotify': <MusicNoteIcon /> ,
    'Movies': <TheatersIcon />,
    'Manga': <MangaIcon />,
    'Travel': <ModeOfTravelIcon />,
    'Restaurants': <RestaurantIcon />,
    'Vinyl': <AlbumIcon />,
    'Image': <ImageIcon />,
    'Object': <ImageSearchIcon />,
  };


const drawerWidth = 170;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + -7px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100.1% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function TemporaryDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (

    <ThemeProvider theme={darkTheme}>

    
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: Theme.palette.primary.main, color: Theme.palette.secondary.main}}>
        <Toolbar >

          <IconButton
            
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
      
                
              ...(open && { display: 'none'}),
              position: 'fixed',
              top: 16, // Ensures it stays at the top of the viewport
              left: 16, // Ensures it stays at the left of the viewport
              zIndex: 1000, // Ensure it's above other elements
                
              
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            <a href="/">
            <img
                    className="avatar"
                    src={'https://preview.redd.it/fallen-angels-v0-wdk2688j5hec1.png?width=1080&crop=smart&auto=webp&s=dec90ac7d89e770013c18158aa595474ce4a68d4'}
                    alt={'Profile'}
                    style={{
                    width: '50px',
                    height: '50px',
                    borderRadius:50,
                    marginTop: 10,
                    marginLeft: 50,
                    }}
                />
                </a>
          </Typography>
          
        </Toolbar>
      </AppBar>
      
      
      <Drawer variant="permanent" open={open} onClick={handleDrawerClose}>
        <DrawerHeader sx={{ backgroundColor: Theme.palette.primary.main, color: Theme.palette.secondary.main}}>
          <IconButton onClick={handleDrawerClose} > 
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <ListItem key={'Home'} disablePadding sx={{ backgroundColor: Theme.palette.primary.main, color: Theme.palette.secondary.main}}>
                <ListItemButton component={Link} to={`/`} onClick={handleDrawerOpen} sx={{ padding: '12px'}}>
                
                    <ListItemIcon sx={{ marginRight: '-20px', color: Theme.palette.secondary.main}} >
                        <HomeIcon/>
                    </ListItemIcon>

                <ListItemText primary={'Home'} primaryTypographyProps={{fontSize: '20px'}} />

                </ListItemButton>
            </ListItem>

        <List sx={{ backgroundColor: Theme.palette.primary.main, color: Theme.palette.secondary.main}}>
        {['Spotify', 'Movies', 'Manga', 'Travel', 'Restaurants', 'Vinyl', 'Image', 'Object'].map((text) => (
            
            <ListItem disablePadding>
                <ListItemButton component={Link} to={`/${text.toLowerCase()}`} >
                
                    <ListItemIcon sx={{marginLeft: '-4px', marginRight: '-20px', color: Theme.palette.secondary.main}}>
                        {iconMap[text] }
                    </ListItemIcon>

                    <ListItemText primary={text} primaryTypographyProps={{fontSize: '16px'}}/>

                </ListItemButton>
            </ListItem>
            
            ))}
        </List>
      </Drawer>
      

    </Box>
    
    </ThemeProvider>
  );
}
