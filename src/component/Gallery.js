import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [hideGridImage, setHideGridImage] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [photosData, setPhotosData] = useState([]);

  
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
  }
}, [activeAlbum]);

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
      {photosData.map((p, i) => (
        <motion.img
          key={i}
          src={p.src}
          className="grid-img"
          loading="lazy"
          decoding="async"
          style={{
            opacity: hideGridImage === p.src ? 0 : 1
          }}
          layoutId={p.src}
          onClick={() => {
            setHideGridImage(p.src);
            setActive(p);
          }}
          whileHover={{ scale: 1.03, opacity: 0.8 }}
        />
      ))}
    </div>
  </>
)}

      <AnimatePresence>
        {active && (
          <motion.div
            className="overlay"
            onClick={() => {
              setActive(null);
              setHideGridImage(null);
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

                <div
                  className={`image-wrapper ${active.spotify ? "" : "no-spotify"}`}

                >
                  <img src={active.src} className="expanded-img" />

                  {active.caption && (
                    <div className="image-caption">
                      {active.caption}
                    </div>
                  )}

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
                </div>

              

              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}