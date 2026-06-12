import React from "react";

import {
  AppBar, Toolbar, CssBaseline,
  Box, IconButton, ListItemButton,
  ListItemIcon, ListItemText, Collapse,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import BookIcon from "@mui/icons-material/MenuBook";
import UpdateIcon from "@mui/icons-material/Update";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TheatersIcon from "@mui/icons-material/Theaters";
import CameraRollIcon from "@mui/icons-material/CameraRoll";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageIcon from "@mui/icons-material/Image";

import { Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";

import "../css/TemporaryDrawer.css";

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

const NAV_ITEMS = [
  "Home",
  "Features",
  "Gallery",
  "Books",
  "Movies",
  "Food",
  "Spotify",
  "Image",
  "Object",
];

const ICON_MAP = {
  Home: <HomeIcon />,
  Features: <UpdateIcon />,
  Spotify: <MusicNoteIcon />,
  Books: <BookIcon />,
  Movies: <TheatersIcon />,
  Gallery: <CameraRollIcon />,
  Food: <RestaurantIcon />,
  Image: <ImageIcon />,
  Object: <ImageSearchIcon />,
};

export default function TemporaryDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="top-menu">
        <CssBaseline />

        <AppBar
          position="fixed"
          className="top-menu__appbar"
        >
          <Toolbar className="top-menu__toolbar">

            {/* Profile */}
            <Box
              component="a"
              href="/"
              className="top-menu__profile"
            >
              <img
                src="https://preview.redd.it/fallen-angels-v0-wdk2688j5hec1.png?width=1080&crop=smart&auto=webp&s=dec90ac7d89e770013c18158aa595474ce4a68d4"
                alt="Profile"
              />
            </Box>

            {/* Menu toggle */}
            <IconButton
              onClick={() => setIsOpen((prev) => !prev)}
              className="top-menu__toggle"
            >
              {isOpen ? (
                <ChevronLeftIcon />
              ) : (
                <MenuIcon />
              )}
            </IconButton>

            {/* Menu */}
            <Collapse
              in={isOpen}
              orientation="horizontal"
              timeout={250}
            >
              <Box className="top-menu__nav">

                {NAV_ITEMS.map((item) => (
                  <ListItemButton
                    key={item}
                    component={Link}
                    to={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase()}`
                    }
                    className="top-menu__item"
                  >
                    <ListItemIcon className="top-menu__icon">
                      {ICON_MAP[item]}
                    </ListItemIcon>

                    <ListItemText
                      primary={item}
                      className="top-menu__text"
                    />
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