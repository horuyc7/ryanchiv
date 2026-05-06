import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';

import '../css/Movies.css';

const Movies = () => {
  const [listDetails, setListDetails] = useState({});
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [MovieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const response = await axios.get('/api/moviesAPI');
        const { moviesData, listDetails, moviesDetails } = response.data;
        //setMovies(moviesData);
        const merged = moviesData.map((m, i) => ({
                          ...m,
                          ...moviesDetails[i]
                        }));

        setMovies(merged);
        setListDetails(listDetails);
        setMovieDetails(moviesDetails);
      } catch (error) {
        console.error('Error fetching movies data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, []);

  const handleMovieClick = (index, event) => {
  const rect = event.target.getBoundingClientRect();

  setSelectedMovie({
    index,
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });

  setExpandedSynopsis(false);
};

  const closeModal = () => {
    setSelectedMovie(null);
    toggleSynopsis();
  };

  const toggleSynopsis = () => {
    setExpandedSynopsis(!expandedSynopsis);
  };

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      const modal = document.querySelector('.details');
      if (modal && !modal.contains(event.target)) {
        closeModal();
      }
    };
  
    document.body.addEventListener('mousedown', handleClickOutsideModal);
    
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, []);

  
  
  return (
    <div className="movies">
      <div className="movies__list">
        <h2 className="movies__list-title">{listDetails.title}</h2>
      </div>

      {loading ? (
          <div className='loading'>
            <Loading/>
          </div>
      ) : (
        <div className="movies__movies">
          {movies.map((movie, index) => (
            <div key={index} className="movie-container">
             <img
              src={movie.imageUrl2}
              alt={movie.href}
              onClick={(e) => handleMovieClick(index, e)}
            />
            </div>
          ))}

          {selectedMovie && (
            <div
                className="details"
                style={{
                  position: 'fixed',
                  top: selectedMovie.y,
                  left: selectedMovie.x,
                  transform: 'translate(-50%, -50%)', // 🔥 THIS centers it
                }}
              >
              <div className="details-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>

                <div className="detail-container">
                  <a href={`https://letterboxd.com${movies[selectedMovie.index].href}`} target="_blank" rel="noopener noreferrer">
                    <img className="details-image" src={movies[selectedMovie.index].imageUrl2} alt={movies[selectedMovie.index].href}/>
                  </a>

                  <div className="details-info">
                    <p className="details-title">
                      {MovieDetails[selectedMovie.index].title}
                    </p>
                    <p className="details-rating">
                      {MovieDetails[selectedMovie.index].rating} / 5 ★ 
                    </p>
                    <p className="details-genres">
                      {MovieDetails[selectedMovie.index].genres.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <p className="description" onClick={toggleSynopsis}>
                  {expandedSynopsis ? MovieDetails[selectedMovie.index].description : MovieDetails[selectedMovie.index].description.slice(0, 150) + '....'}
                </p>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
