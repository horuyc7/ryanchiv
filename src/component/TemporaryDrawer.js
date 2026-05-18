import * as React from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import BookIcon from '@mui/icons-material/MenuBook';
import InterestsIcon from '@mui/icons-material/Interests';
import UpdateIcon from '@mui/icons-material/Update';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheatersIcon from '@mui/icons-material/Theaters';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ImageIcon from '@mui/icons-material/Image';

import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import SvgIcon from '@mui/material/SvgIcon';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d6550e",
    },
    secondary: {
      main: "#8be4a9",
    },
  },
});

const iconMap = {
  HomeIcon: <HomeIcon />,
  Features: <UpdateIcon />,
  Spotify: <MusicNoteIcon />,
  Books: <BookIcon />,
  Movies: <TheatersIcon />,
  Gallery: <LuggageIcon />,
  Restaurants: <RestaurantIcon />,
  Image: <ImageIcon />,
  Object: <ImageSearchIcon />,
};

export default function TopExpandMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            backgroundColor: darkTheme.palette.primary.main,
            color: darkTheme.palette.secondary.main,
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <a href="/">
              <img
                className="avatar"
                src="https://preview.redd.it/fallen-angels-v0-wdk2688j5hec1.png?width=1080&crop=smart&auto=webp&s=dec90ac7d89e770013c18158aa595474ce4a68d4"
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: 24,
                  marginTop: "10px",
                  marginLeft: "-4px",
                }}
              />
            </a>

            <IconButton
              onClick={() => setOpen(!open)}
              sx={{
                color: '#491e07',
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            <Collapse
  in={open}
  orientation="horizontal"
  timeout={250}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      ml: -1.5,
      gap: .8,
    }}
  >
    {[
  "Home",
  "Features",
  "Spotify",
  "Books",
  "Movies",
  "Gallery",
  "Restaurants",
  "Image",
  "Object",
].map((text) => (
  <ListItemButton
    key={text}
    component={Link}
    to={text === "Home" ? "/" : `/${text.toLowerCase()}`}
    sx={{
      minWidth: 36,
      height: 25,
      px: 0.5,
      borderRadius: 2,
      overflow: "hidden",
      transition: "all 0.2s ease",
      color: '#491e07',

      "& .MuiListItemText-root": {
        opacity: 0,
        width: 0,
        transition: "0.2s",
        whiteSpace: "nowrap",
      },

      "& .MuiTypography-root": {
        fontSize: "0.90rem",
        fontWeight: 400,
      },

      "&:hover": {
        px: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
      },

      "&:hover .MuiListItemText-root": {
        opacity: 1,
        width: "auto",
        marginLeft: "3px",
        marginTop: "6px",
      },
    }}
  >
    <ListItemIcon
      sx={{
        color: '#491e07',
        minWidth: 0,

        "& svg": {
          fontSize: "1.45rem",
        },
      }}
    >
      {text === "Home" ? <HomeIcon /> : iconMap[text]}
    </ListItemIcon>

    <ListItemText primary={text} />
  </ListItemButton>
))}
  </Box>
</Collapse>
          </Toolbar>
        </AppBar>

        <Toolbar />
      </Box>
    </ThemeProvider>
  );
}