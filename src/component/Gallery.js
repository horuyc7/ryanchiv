import { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
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
  const [photosData] = useState(() => shuffle(photos));
  const [active, setActive] = useState(null);
  const [hideGridImage, setHideGridImage] = useState(null);


  return (
    <div className="gallery ">
      {/* GRID */}
      <div className="grid">
        {photosData.map((p, i) => (
          <motion.img
            key={i}
            src={p.src}
            className="grid-img"
            style={{
  opacity: hideGridImage === p.src ? 0 : 1
}}
            layoutId={p.src}
            onClick={() => {
  setHideGridImage(p.src);
  setActive(p);
}}
            whileHover={{ scale: 1.04, opacity: 0.8 }}
          />
        ))}
      </div>

      {/* EXPANDED VIEW */}
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
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
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

                  {active.spotify && (
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