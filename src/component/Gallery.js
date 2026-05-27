import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import ColorThief from "color-thief-browser";
import Loading from "./LoadingCircle";
import { useRef } from "react";

import albumsData from "../data/albums.json";

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

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [viewMode]);

  /* wheel feed navigation */
  useEffect(() => {
    if (viewMode !== "feed") return;

    let locked = false;

    const handleWheel = (e) => {
      if (!Array.isArray(photosData) || photosData.length === 0) return;

      e.preventDefault();
      if (locked) return;
      if (Math.abs(e.deltaY) < 15) return;

      locked = true;

      if (e.deltaY > 0) {
        setFeedIndex((p) =>
          Math.min(p + 1, photosData.length - 1)
        );
      } else {
        setFeedIndex((p) => Math.max(p - 1, 0));
      }

      setTimeout(() => {
        locked = false;
      }, 400);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () =>
      window.removeEventListener("wheel", handleWheel);
  }, [viewMode, photosData]);

  /* preload */
  useEffect(() => {
    if (!Array.isArray(photosData)) return;

    const next = photosData?.[feedIndex + 1];
    const prev = photosData?.[feedIndex - 1];

    if (next?.src) new Image().src = cloudinaryUrl(next.src, 1400);
    if (prev?.src) new Image().src = cloudinaryUrl(prev.src, 1400);
  }, [feedIndex, photosData]);

  const handleOpen = (p) => {
      if (!p?.src) return;

      const currentLoadId = ++loadIdRef.current;

      const low = cloudinaryUrl(p.src, 400);
      const high = cloudinaryUrl(p.src, 1400);

      setImgLoaded(false);
      setActive(p);

      setLowSrc(low);
      setHighSrc(null);

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = low;

      img.onload = async () => {
        if (loadIdRef.current !== currentLoadId) return;

        try {
          const colorThief = new ColorThief();
          const [r, g, b] = colorThief.getColor(img);
          setThemeColor(`${r},${g},${b}`);
        } catch (e) {}

        const hd = new Image();
        hd.src = high;

        hd.onload = () => {
          if (loadIdRef.current !== currentLoadId) return;

          setHighSrc(high);
          requestAnimationFrame(() => {
            setImgLoaded(true);
          });
        };
      };
    };

  const loadAlbum = async (album) => {
    setLoadingAlbum(true);
    setActiveAlbum(album);
    setPhotosData([]);
    setShuffledPhotos([]);
    setVisibleCount(20);
    setFeedIndex(0);

    try {
      const res = await fetch(`/api/gallery?album=${album.album}`);
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
    }
    finally {
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
        <div className="albums">
          {albums.map((album, i) => (
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
              ← back
            </div>

            <div className="album-header-title">
              {activeAlbum.title}
            </div>
          </div>

          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>

            <button
              className={viewMode === "feed" ? "active" : ""}
              onClick={() => setViewMode("feed")}
            >
              Feed
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
                />
              ))}
            </div>
          )}
        </>
      )}

     {viewMode === "feed" && photosData?.length > 0 && (
  <div className="tiktok-feed">
    <AnimatePresence mode="wait">
      <motion.div
        key={feedIndex}
        className="tiktok-item"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(e, info) => {
          const offset = info.offset.y;
          const velocity = info.velocity.y;

          if (offset < -80 || velocity < -500) {
            setFeedIndex((p) =>
              Math.min(p + 1, photosData.length - 1)
            );
          }

          if (offset > 80 || velocity > 500) {
            setFeedIndex((p) => Math.max(p - 1, 0));
          }
        }}
      >
        {/* IMAGE WRAPPER */}
        <div className="tiktok-image-wrapper">
          <div
            className={`tiktok-image-container ${
              photosData[feedIndex]?.spotify ? "has-spotify" : ""
            }`}
          >
            <img
              src={
                photosData?.[feedIndex]?.src
                  ? cloudinaryUrl(photosData[feedIndex].src, 1400)
                  : ""
              }
              className="tiktok-img"
            />

           {photosData?.[feedIndex] && (
              <div className="tiktok-caption">
                {formatCaption(photosData[feedIndex])}
              </div>
            )}
          </div>
        </div>

        {photosData?.[feedIndex]?.spotify && (
          <iframe
            className="tiktok-spotify"
            src={
              photosData[feedIndex].spotify.includes('embed')
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
      </motion.div>
    </AnimatePresence>
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