import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';
import ColorThief from "color-thief-browser";

import '../css/Gallery.css';
import photos from "../data/photos.json";


function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function Gallery() {
  const [albums] = useState(photos);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [active, setActive] = useState(null);
  const [hideGridImage, setHideGridImage] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [photosData, setPhotosData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cloudinaryUrl = (path, width) =>
  `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload/c_scale,w_${width}/f_auto,q_auto/${path}`;
  const [themeColor, setThemeColor] = useState("20,20,20");

  useEffect(() => {
  if (!active) return;

  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.src = cloudinaryUrl(active.src, 400);

  img.onload = async () => {
    try {
      const colorThief = new ColorThief();

      const [r, g, b] = colorThief.getColor(img);

      setThemeColor(`${r}, ${g}, ${b}`);
    } catch (err) {
      console.log(err);
    }
  };
}, [active]);

  useEffect(() => {
  if (activeAlbum) {
    setPhotosData(shuffle(activeAlbum.photos));
    setVisibleCount(20);
  }
}, [activeAlbum]);

useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      setVisibleCount((prev) =>
        Math.min(prev + 20, photosData.length)
      );
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [photosData]);

useEffect(() => {
  photosData.slice(0, visibleCount).forEach((p) => {
    const img = new Image();

    img.src = cloudinaryUrl(p.src, 1600);
  });
}, [photosData, visibleCount]);

const handleBack = () => {
  setActiveAlbum(null);
  setPhotosData([]);
  setActive(null);
  setHideGridImage(null);
};

  return (
    <div className="gallery" style={{
      marginLeft: '0px',
    }}>
      {!activeAlbum && (
      <div className="albums">
        {albums.map((album, i) => (
          <div
            key={i}
            className="album-card"
            onClick={() => setActiveAlbum(album)}
          >
            <img src={cloudinaryUrl(album.cover, 600)} className="album-img" />

            <div className="album-title">
              {album.title}
            </div>
          </div>
        ))}
      </div>
    )}

      {activeAlbum && (
  <>
    <div className="album-header">
      <div className="back-btn" onClick={() => setActiveAlbum(null)}>
        ← back
      </div>

      <div className="album-header-title">
        {activeAlbum.title}
      </div>
    </div>

    <div className="grid">
      {photosData.slice(0, visibleCount).map((p, i) => (
        <motion.img
          key={p.src}
          src={cloudinaryUrl(p.src, 400)}
          className="grid-img"
          loading={i < 6 ? "eager" : "lazy"}
          decoding="async"
          style={{
            visibility: hideGridImage === p.src ? "hidden" : "visible"
          }}
          layoutId={p.src}
          onClick={() => {
            setImgLoaded(false);
            setHideGridImage(p.src);
            setActive(p);
          }}
          whileHover={{ scale: 1.03, opacity: 0.8 }}
        />
      ))}
    </div>
  </>
)}

      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {active && (
          <motion.div
            className="overlay"
            style={{
              background: `
                radial-gradient(
                  circle at center,
                  rgba(${themeColor}, 0.15),
                  rgba(0,0,0,0.94) 70%
                )
              `
            }}
            onClick={() => {
              setActive(null);
              setHideGridImage(null);
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
                boxShadow: `
                  0 0 60px rgba(${themeColor}, 0.2)
                `
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            >
              <div className={`image-wrapper ${active.spotify ? "" : "no-spotify"}`}>
                <div className="img-stack">
                  <img
                    src={cloudinaryUrl(active.src, 400)}
                    className="expanded-img low"
                  />

                  <img
                    src={cloudinaryUrl(active.src, 1600)}
                    className={`expanded-img high ${imgLoaded ? "show" : ""}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                </div>
                {active.caption && (
                  <div className="image-caption">{active.caption}</div>
                )}

                
              </div>
              {active.spotify && (
                <motion.iframe
                  className="spotify-iframe"
                  src={active.spotify}
                  height="80"
                  width="100%"
                  frameBorder="0"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media"

                  initial={{
                    opacity: 0,
                    y: -10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{ opacity: 0 }}

                  transition={{
                    duration: 0.34,
                    ease: "easeOut",
                    delay: 0.1
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body // This sends it to the body, away from .container
    )}
  </div>
  );
}