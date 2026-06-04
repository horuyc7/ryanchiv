import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import ColorThief from "color-thief-browser";
import Loading from "./LoadingCircle";
import { useRef } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";

import albumsData from "../data/albums.json";
import cities from "../data/cities.json";
import { track } from "@vercel/analytics";

import "../css/Gallery.css";

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Gallery() {
  const [albums] = useState(albumsData);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [active, setActive] = useState(null);

  const [photosData, setPhotosData] = useState([]);
  const [shuffledPhotos, setShuffledPhotos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const [themeColor, setThemeColor] = useState("20,20,20");

  const [viewMode, setViewMode] = useState("grid");
  const [feedIndex, setFeedIndex] = useState(0);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [lowSrc, setLowSrc] = useState(null);
  const [highSrc, setHighSrc] = useState(null);

  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const loadIdRef = useRef(0);

  const [selectedCity, setSelectedCity] = useState("all");
  const [albumsList, setAlbumsList] = useState([]);
  const displayAlbums =
  selectedCity === "all" ? albums : albumsList;

  const [cityLoading, setCityLoading] = useState(false);

  const isInitialRender = useRef(true);

  const [feedReadyIndex, setFeedReadyIndex] = useState(-1);

  useEffect(() => {
    if (viewMode !== "feed") return;

    track("story_view", {
      album: activeAlbum?.title,
      index: feedIndex,
    });
  }, [feedIndex]);

  const timeAgo = (createdAt) => {
    if (!createdAt) return "";

    const created = new Date(createdAt);
    const diffMs = Date.now() - created.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h`;
    if (days === 1) return "1d";

    return `${days}d`;
  };

  useEffect(() => {
  let cancelled = false;

  async function waitImage() {
    setFeedReadyIndex(-1);

    const src = photosData?.[feedIndex]?.src;
    if (!src) return;

    const img = new Image();
    img.src = cloudinaryUrl(src, 1400);

    try {
      // waits until fully decoded (NOT just "loaded")
      await img.decode();
    } catch (e) {
      // fallback if decode fails
      await new Promise((res) => (img.onload = res));
    }

    if (!cancelled) {
      setFeedReadyIndex(feedIndex);
    }
  }

  waitImage();

  return () => {
    cancelled = true;
  };
}, [feedIndex, photosData]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    let timer;

    async function fetchAlbums() {
      setAlbumsList([]);

      if (selectedCity === "all") {
        
        setCityLoading(false); // IMPORTANT FIX
        return;
      }

      timer = setTimeout(() => setCityLoading(true), 200);

      try {
        const res = await fetch(`/api/gallery?city=${selectedCity}`);
        const data = await res.json();

        setAlbumsList(data);
      } catch (err) {
        console.error(err);
        setAlbumsList([]);
      } finally {
        clearTimeout(timer);
        setCityLoading(false);
      }
      }

      fetchAlbums();

      return () => clearTimeout(timer);
  }, [selectedCity]);

  const cloudinaryUrl = (path, width) =>
    path
      ? `https://res.cloudinary.com/${
          process.env.REACT_APP_CLOUDINARY_ID
        }/image/upload/c_scale,w_${width}/f_auto,q_auto:eco/${path}`
      : "";

  const formatCaption = (p) => {
    const caption = p?.caption?.trim();
    const city = p?.city?.trim();

    if (caption && city) return `${caption}\n${city}`;
    if (caption) return caption;
    if (city) return city;
    return "";
  };

  /* FIX: safe reset */
  useEffect(() => {
    if (!Array.isArray(photosData)) return;

    if (photosData.length === 0) {
      setFeedIndex(0);
      return;
    }

    if (feedIndex >= photosData.length) {
      setFeedIndex(0);
    }
  }, [photosData, feedIndex]);

  /* lock scroll feed */
  useEffect(() => {
  if (viewMode !== "feed") return;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
  };
}, [viewMode]);

  /* preload */
  useEffect(() => {
    if (!Array.isArray(photosData)) return;

    const next = photosData?.[feedIndex + 1];
    const prev = photosData?.[feedIndex - 1];

    if (next?.src) new Image().src = cloudinaryUrl(next.src, 1400);
    if (prev?.src) new Image().src = cloudinaryUrl(prev.src, 1400);
  }, [feedIndex, photosData]);

  const handleOpen = async (p) => {
    track("photo_opened", {
      album: activeAlbum?.title,
      image: p.src,
    });

    if (!p?.src) return;

    const currentLoadId = ++loadIdRef.current;

    const low = cloudinaryUrl(p.src, 400);
    const high = cloudinaryUrl(p.src, 1400);

    setImgLoaded(false);
    setActive(p);
    setLowSrc(low);
    setHighSrc(null);

    try {
      const lowImg = new Image();
      lowImg.crossOrigin = "Anonymous";
      lowImg.src = low;

      await lowImg.decode();

      if (loadIdRef.current !== currentLoadId) return;

      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(lowImg);
      setThemeColor(`${r},${g},${b}`);

      const hdImg = new Image();
      hdImg.src = high;

      await hdImg.decode();

      if (loadIdRef.current !== currentLoadId) return;

      setHighSrc(high);
      setImgLoaded(true);

    } catch (e) {
      // fallback safety
      if (loadIdRef.current === currentLoadId) {
        setHighSrc(high);
        setImgLoaded(true);
      }
    }
  };

  const loadAlbum = async (album) => {

    track("album_opened", {
      album: album.title,
      city: selectedCity,
    });

    const raw =
      album?.album || album?.id || album?.slug || album?.title;

    if (!raw) return;

    const albumId = String(raw)
      .toLowerCase()
      .replace(/\s+/g, ""); // remove spaces

    setLoadingAlbum(true);
    setActiveAlbum(album);
    setPhotosData([]);
    setShuffledPhotos([]);
    setVisibleCount(20);
    setFeedIndex(0);

    try {
      const res = await fetch(
        `/api/gallery?album=${encodeURIComponent(albumId)}&city=${selectedCity}`
      );

      const data = await res.json();

      const photos =
        data?.photos ??
        (Array.isArray(data) ? data?.[0]?.photos : []) ??
        [];

      const cleanPhotos = Array.isArray(photos) ? photos : [];

      setPhotosData(cleanPhotos);
      setShuffledPhotos(shuffleArray(cleanPhotos));
    } catch (err) {
      console.error(err);
      setPhotosData([]);
      setShuffledPhotos([]);
    } finally {
      setLoadingAlbum(false);
    }
  };

  useEffect(() => {
    if (viewMode !== "grid") return;

    const handleScroll = () => {
      if (!Array.isArray(photosData) || photosData.length === 0) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 300) {
        setVisibleCount((prev) =>
          Math.min(prev + 20, photosData.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [photosData, viewMode]);

  /* keyboard navigation */
  useEffect(() => {
    const handleKey = (e) => {
      if (!Array.isArray(photosData) || photosData.length === 0) return;

      /* FEED MODE */
      if (viewMode === "feed") {
        if (
          e.key === "ArrowRight" ||
          e.key === "ArrowDown"
        ) {
          setFeedIndex((p) =>
            Math.min(p + 1, photosData.length - 1)
          );
        }

        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowUp"
        ) {
          setFeedIndex((p) => Math.max(p - 1, 0));
        }
      }

      /* GRID POPUP MODE */
      if (active) {
        const currentIndex = photosData.findIndex(
          (p) => p.src === active.src
        );

        if (currentIndex === -1) return;

        if (
          e.key === "ArrowRight" ||
          e.key === "ArrowDown"
        ) {
          const nextIndex = Math.min(
            currentIndex + 1,
            photosData.length - 1
          );

          handleOpen(photosData[nextIndex]);
        }

        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowUp"
        ) {
          const prevIndex = Math.max(
            currentIndex - 1,
            0
          );

          handleOpen(photosData[prevIndex]);
        }

        if (e.key === "Escape") {
          setActive(null);
          setLowSrc(null);
          setHighSrc(null);
          setImgLoaded(false);
        }
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
}, [photosData, active, viewMode]);

  return (
    <div className="gallery">

      {!activeAlbum && (
  <>
    <div className="gallery-topbar">
      <h2 className="gallery-heading">
        Gallery
      </h2>

      <div className="city-filter">
        <FormControl
          sx={{
            minWidth: 140,

            "& .MuiInputLabel-root": {
              color: "#f7f7f7",
              marginLeft: "-3px",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#bbf3d1",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.1)",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#bbf3d1",
            },

            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "#bbf3d1 !important",
            },

            "& .MuiSvgIcon-root": {
              color: "#bbf3d1",
            },

            "& .MuiSelect-select": {
              color: "#f7f7f7",
              padding: "10px 18px",
            },
          }}
        >
          <InputLabel>Place</InputLabel>

          <Select
            value={selectedCity}
            label="Place"
            onChange={(e) => setSelectedCity(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: "rgba(20,20,20,0.95)",

                  "& .MuiMenuItem-root": {
                    color: "#f7f7f7",
                  },

                  "& .MuiMenuItem-root:hover": {
                    background: "rgba(95,96,95,0.1)",
                  },

                  "& .Mui-selected": {
                    background: "#bbf3d122 !important",
                  },

                  "& .Mui-selected:hover": {
                    background: "rgba(187,243,209,0.22) !important",
                  },
                },
              },
            }}
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>


          {cityLoading ? (
            <div className="gallery-loading">
              <Loading />
            </div>
          ) : (
            <div className="albums">
              {displayAlbums.map((album, i) => (
                <div
                  key={i}
                  className="album-card"
                  onClick={() => loadAlbum(album)}
                >
                  <img
                    src={cloudinaryUrl(album.cover, 800)}
                    className="album-img"
                  />
                  <div className="album-title">{album.title}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeAlbum && (
        <>
          <div className="album-header">
            <div
              className="back-btn"
              onClick={() => {
                setActiveAlbum(null);
                setPhotosData([]);
                setActive(null);
              }}
            >
              ← Back
            </div>

            <div className="album-header-title">
              {activeAlbum.title}
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => {
                track("grid_mode_entered", {
                  album: activeAlbum?.title,
                });

                setViewMode("grid");
              }}
            >
              Grid
            </button>

            <button
              className={viewMode === "feed" ? "active" : ""}
              onClick={() => {
                track("story_mode_entered", {
                  album: activeAlbum?.title,
                });
    
                setViewMode("feed"); 
              }}
            >
              Story
            </button>
          </div>

          {loadingAlbum && <div className="gallery-loading"><Loading /></div>}

          {viewMode === "grid" && (
            <div className="grid">
              {shuffledPhotos.slice(0, visibleCount).map((p, i) => (
                <motion.img
                  key={p.src}
                  src={cloudinaryUrl(p.src, 400)}
                  className="grid-img"
                  loading={i < 6 ? "eager" : "lazy"}
                  onClick={() => handleOpen(p)}
                  whileHover={{ scale: 1.03, opacity: 0.8 }}
                  style={{
                    visibility: active?.src === p.src ? "hidden" : "visible"
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === "feed" && photosData?.length > 0 && (
      <div className="tiktok-feed-wrapper">

        <div className="tiktok-feed">
          <AnimatePresence mode="wait">
            <motion.div
              key={feedIndex}
              className="tiktok-item"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <div className="story-content">

                <div className="tiktok-image-wrapper">
                  <div
                    className={`tiktok-image-container ${
                      photosData[feedIndex]?.spotify ? "has-spotify" : ""
                    }`}
                  >

                    <div
                      className="story-tap-left"
                      onClick={() =>
                        setFeedIndex((p) => Math.max(p - 1, 0))
                      }
                    />

                    <div
                      className="story-tap-right"
                      onClick={() =>
                        setFeedIndex((p) =>
                          Math.min(p + 1, photosData.length - 1)
                        )
                      }
                    />

                    <div className="story-progress">
                      {photosData.map((_, i) => (
                        <div key={i} className="story-progress-track">
                          <div
                            className={`story-progress-fill ${
                              i < feedIndex
                                ? "done"
                                : i === feedIndex
                                ? "active"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="story-date">
                      {timeAgo(photosData[feedIndex]?.created_at)}
                    </div>

                    <img
                      src={cloudinaryUrl(photosData[feedIndex].src, 1400)}
                      className={`tiktok-img ${
                        photosData[feedIndex]?.spotify ? "has-spotify" : ""
                      }`}
                    />

                    {photosData?.[feedIndex] && (
                        <div className="tiktok-caption">
                          {formatCaption(photosData[feedIndex])}
                        </div>
                    )}
                  </div>
                </div>

                {photosData?.[feedIndex]?.spotify &&
                  feedReadyIndex === feedIndex && (
                  <iframe
                    className="tiktok-spotify"
                    src={
                      photosData[feedIndex].spotify.includes("embed")
                        ? photosData[feedIndex].spotify
                        : `https://open.spotify.com/embed/track/${
                            photosData[feedIndex].spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1]
                          }?utm_source=generator&theme=0`
                    }
                    height="80"
                    width="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media"
                  />
                )}
              </div>
              </motion.div>
            </AnimatePresence>
            </div>

          <div
            className="story-backdrop"
            onClick={() => setViewMode("grid")}
          />
        </div>
      )}

      {typeof document !== "undefined" &&
        viewMode !== "feed" &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                className="overlay"
                style={{
                  background: `radial-gradient(
                    circle at center,
                    rgba(${themeColor}, 0.1),
                    rgba(0,0,0,0.9) 85%
                  )`,
                }}
                onClick={() => {
                  setActive(null);
                  setLowSrc(null);
                  setHighSrc(null);
                  setImgLoaded(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  layoutId={active.src}
                  className="expanded"
                  style={{
                    boxShadow: `0 0 70px rgba(${themeColor}, 0.2)`,
                    borderRadius: '12px',
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                >
                  <div
                    className={`image-wrapper ${
                      active.spotify ? "" : "no-spotify"
                    }`}
                  >
                    <div className="img-stack">
                      <img
                        src={lowSrc}
                        className="expanded-img low"
                      />

                      <img
                        src={highSrc || lowSrc}
                        className={`expanded-img high ${imgLoaded ? "show" : ""}`}
                        onLoad={() => setImgLoaded(true)}
                      />
                    </div>

                    {active && (
                      <div className="image-caption">
                        {formatCaption(active)}
                      </div>
                    )}
                  </div>

                  {active.spotify && (
                    <motion.iframe
                      className="spotify-iframe"
                      src={
                        active.spotify.includes('embed')
                          ? active.spotify
                          : `https://open.spotify.com/embed/track/${
                              active.spotify.match(/track\/([a-zA-Z0-9]+)/)?.[1]
                            }?utm_source=generator&theme=0`
                      }
                      height="80"
                      width="100%"
                      frameBorder="0"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media"
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
        
    </div>
  );
}