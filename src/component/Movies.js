import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loading from "./LoadingCircle";

import "../css/Movies.css";

const Movies = () => {
  const [listDetails, setListDetails] = useState({});
  const [movies, setMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("/api/moviesAPI");

        const { moviesData, listDetails, moviesDetails } =
          res.data;

        // Merge movie + metadata
        const merged = moviesData.map((m, i) => ({
          ...m,
          ...moviesDetails[i],
        }));

        setMovies(merged);
        setListDetails(listDetails);
        setMovieDetails(moviesDetails);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Open modal near clicked movie
  const openMovieModal = (index, event) => {
    const rect = event.target.getBoundingClientRect();

    const modalWidth = 300;
    const modalHeight = 250;
    const padding = 10;

    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;

    // keep modal inside viewport
    x = Math.min(
      window.innerWidth - modalWidth / 2 - padding,
      Math.max(modalWidth / 2 + padding, x)
    );

    y = Math.min(
      window.innerHeight - modalHeight / 2 - padding,
      Math.max(modalHeight / 2 + padding, y)
    );

    setSelectedMovie({ index, x, y });
    setExpandedSynopsis(false);
  };

  const closeMovieModal = () => {
    setSelectedMovie(null);
    setExpandedSynopsis(false);
  };

  const toggleSynopsis = () => {
    setExpandedSynopsis((prev) => !prev);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const modal = document.querySelector(".movies__modal");
      if (modal && !modal.contains(event.target)) {
        closeMovieModal();
      }
    };

    document.body.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.body.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  // Reposition modal
  useEffect(() => {
    if (!selectedMovie || !modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();

    let x = selectedMovie.x;
    let y = selectedMovie.y;

    const padding = 10;

    x = Math.min(
      window.innerWidth - rect.width / 2 - padding,
      Math.max(rect.width / 2 + padding, x)
    );

    y = Math.min(
      window.innerHeight - rect.height / 2 - padding,
      Math.max(rect.height / 2 + padding, y)
    );

    modalRef.current.style.left = `${x}px`;
    modalRef.current.style.top = `${y}px`;
  }, [selectedMovie]);

  return (
    <div className="movies">
      {/* Header */}
      <div className="movies__header">
        <h2 className="movies__title">
          {listDetails.title}
        </h2>
      </div>

      {loading ? (
        <div className="movies__loading">
          <Loading />
        </div>
      ) : (
        <div className="movies__grid">
          {/* Grid */}
          {movies.map((movie, index) => (
            <div
              key={index}
              className="movies__item"
            >
              <img
                className="movies__image"
                src={movie.imageUrl2}
                alt={movie.href}
                onClick={(e) =>
                  openMovieModal(index, e)
                }
              />
            </div>
          ))}

          {/* Modal */}
          {selectedMovie && (
            <div
              className="movies__modal"
              ref={modalRef}
              style={{
                position: "fixed",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="movies__modal-content">
                <span
                  className="movies__close"
                  onClick={closeMovieModal}
                >
                  &times;
                </span>

                {/* Movie info */}
                <div className="movies__details">
                  <a
                    href={`https://letterboxd.com${movies[selectedMovie.index].href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="movies__poster"
                      src={
                        movies[selectedMovie.index]
                          .imageUrl2
                      }
                      alt={movies[selectedMovie.index].href}
                    />
                  </a>

                  <div className="movies__info">
                    <p className="movies__movie-title">
                      {
                        movieDetails[selectedMovie.index]
                          .title
                      }
                    </p>

                    <p className="movies__rating">
                      {
                        movieDetails[selectedMovie.index]
                          .rating
                      }{" "}
                      / 5 ★
                    </p>

                    <p className="movies__genres">
                      Genres:{" "}
                      {movieDetails[
                        selectedMovie.index
                      ].genres.slice(0, 3).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Synopsis */}
                <p
                  className="movies__description"
                  onClick={toggleSynopsis}
                >
                  {expandedSynopsis
                    ? movieDetails[
                        selectedMovie.index
                      ].description
                    : movieDetails[
                        selectedMovie.index
                      ].description.slice(0, 150) +
                      "..."}
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