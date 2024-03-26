import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/Movies.css';

const Movies = () => {
  const [listDetails, setListDetails] = useState({});
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [MovieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const response = await axios.get('/api/moviesAPI');
        const { moviesData, listDetails, moviesDetails } = response.data;
        setMovies(moviesData);
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

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie + 1);
    setExpandedSynopsis(false);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    toggleSynopsis();
  };

  const toggleSynopsis = () => {
    setExpandedSynopsis(!expandedSynopsis);
  };

  const toggleReview = (index) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
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
        <p className="movies__list-description">{listDetails.description}</p>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="movies__movies">
          {movies.map((movie, index) => (
            <div key={index} className="movie-container">
              <img src={movie.imageUrl} alt={movie.href} onClick={() => handleMovieClick(index)}/>
            </div>
          ))}

          {selectedMovie && (
          
            <div className="details">
              <div className="details-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>

                <div className="detail-container">
                  <a href={`https://letterboxd.com${movies[selectedMovie - 1].href}`} target="_blank" rel="noopener noreferrer">
                    <img className="details-image" src={movies[selectedMovie - 1].imageUrl} alt={movies[selectedMovie - 1].href}/>
                  </a>

                  <div className="details-info">
                    <p className="details-title">
                      {MovieDetails[selectedMovie - 1].title}
                    </p>
                    <p className="details-rating">
                      {MovieDetails[selectedMovie - 1].rating} ★
                    </p>
                    <p className="details-genres">
                      {MovieDetails[selectedMovie - 1].genres.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <p className="description" onClick={toggleSynopsis}>
                  {expandedSynopsis ? MovieDetails[selectedMovie - 1].description : MovieDetails[selectedMovie - 1].description.slice(0, 200) + '....'}
                </p>

                <p className="reviews-header">Reviews</p>

                {MovieDetails[selectedMovie - 1].userReviews.map(
                  (review, index) => (
                    <div key={index} className="review-container">
                      <p className="user">{review.name}</p>
                      <p className="user-rating">{review.rating}</p>

                      <p className="user-text" onClick={() => toggleReview(index)}>
                        {expandedReviews[index] || review.text.length <= 200 ? review.text : review.text.slice(0, 200) + '....'}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
