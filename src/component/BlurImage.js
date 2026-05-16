import { useState, useEffect } from "react";

function BlurImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (!src) {
      setImgSrc("/placeholder-book.jpg");
      return;
    }

    const img = new Image();

    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setLoaded(true);
    };

    img.onerror = () => {
      setImgSrc("/placeholder-book.jpg");
      setLoaded(true);
    };
  }, [src]);

  return (
    <div className="blur-image-wrapper">
      <img
        src={imgSrc}
        alt={alt}
        className={`blur-image ${
          loaded ? "loaded" : "loading"
        }`}
      />
    </div>
  );
}

export default BlurImage;