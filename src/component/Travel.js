import React, { useState } from 'react';

const Travel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '80vh', cursor: 'pointer' }} onClick={nextImage}>
      <img 
        src={images[currentIndex]} 
        alt={`Image ${currentIndex}`} 
        style={{ width: '100%', height: '100%', objectFit: 'cover'}} 
      />
    </div>
  );
};

export default Travel;