import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from './Loading';

import '../css/Watchlist.css';

const Watchlist = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // { listIndex, movieIndex }
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const response = await axios.get('/api/watchlistAPI');
        setWatchlists(response.data.watchlists);
      } catch (error) {
        console.error('Error fetching watchlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetData();
  }, []);

  const handleMovieClick = (listIndex, movieIndex) => {
    setSelectedMovie({ listIndex, movieIndex });
    setExpandedSynopsis(false);
    setExpandedReviews({});
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setExpandedSynopsis(false);
    setExpandedReviews({});
  };

  const toggleSynopsis = () => {
    setExpandedSynopsis(!expandedSynopsis);
  };

  const toggleReview = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
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
    <div className="watchlist">
      {loading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        watchlists.map((watchlist, listIndex) => (
          <div key={listIndex} className="movies__list">
            <h2 className="movies__list-title">{watchlist.listDetails.title || `Watchlist ${listIndex + 1}`}</h2>
            <p className="movies__list-description">{watchlist.listDetails.description}</p>
            <div className="movies__movies">
              {watchlist.movies.map((movie, movieIndex) => (
                <div key={movieIndex} className="movie-container">
                  <img
                    src={movie.imageUrl}
                    alt={movie.href}
                    onClick={() => handleMovieClick(listIndex, movieIndex)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selectedMovie && (
        <div className="details">
          <div className="details-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>

            {(() => {
              const { listIndex, movieIndex } = selectedMovie;
              const movie = watchlists[listIndex].movies[movieIndex];
              const details = watchlists[listIndex].moviesDetails[movieIndex];

              return (
                <>
                  <div className="detail-container">
                    <a
                      href={`https://letterboxd.com${movie.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img className="details-image" src={movie.imageUrl} alt={movie.href} />
                    </a>

                    <div className="details-info">
                      <p className="details-title">{details.title}</p>
                      <p className="details-rating">{details.rating} / 5 ★</p>
                      <p className="details-genres">{details.genres.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>

                  <p className="description" onClick={toggleSynopsis}>
                    {expandedSynopsis
                      ? details.description
                      : `${details.description.slice(0, 150)}...`}
                  </p>

                  <p className="reviews-header">Reviews</p>
                  {details.userReviews.map((review, index) => (
                    <div key={index} className="review-container">
                      <p className="user">{review.name}</p>
                      <p className="user-rating">{review.rating}</p>
                      <p
                        className="user-text"
                        onClick={() => toggleReview(index)}
                      >
                        {expandedReviews[index] || review.text.length <= 200
                          ? review.text
                          : `${review.text.slice(0, 200)}...`}
                      </p>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
