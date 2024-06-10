import React, { useState } from 'react';

const Travel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (

    
    <div style={{ position: 'relative', width: '100vw', height: '90vh', cursor: 'pointer' }} onClick={nextImage}>
      <img 
        src={images[currentIndex]} 
        alt={`${currentIndex}`} 
        style={{ width: '100%', height: '100%', objectFit: 'contain'}} 
      />
    </div>
  );
};

export default Travel;