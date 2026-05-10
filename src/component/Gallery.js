import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from 'react-dom';

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
  const [albums] = useState(() => shuffle(photos));
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [active, setActive] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [photosData, setPhotosData] = useState([]);
const [visibleCount, setVisibleCount] = useState(20);

  
  useEffect(() => {
    if (active) {
      setTimeout(() => setShowIframe(true), 250);
    } else {
      setShowIframe(false);
    }
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

const handleBack = () => {
  setActiveAlbum(null);
  setPhotosData([]);
  setActive(null);
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
            <img src={album.cover} className="album-img" />

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
          key={i}
          src={p.src}
          className="grid-img"
          loading="lazy"
          decoding="async"
          layoutId={p.src}
          onClick={() => {
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
            onClick={() => {
              setActive(null);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={active.src}
              className="expanded"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={`image-wrapper ${active.spotify ? "" : "no-spotify"}`}>
                <img src={active.src} className="expanded-img" />
                {active.caption && (
                  <div className="image-caption">{active.caption}</div>
                )}

                
              </div>
              {active.spotify && showIframe && (
                  <iframe
                    className="spotify-iframe"
                    src={active.spotify}
                    height="80"
                    width="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media"
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