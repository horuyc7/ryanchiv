import React, { useState, useEffect } from 'react';
import axios from 'axios';
import placeholderImage from './images/placeholder.jpg';
import './Movies.css';

const Movies = () => {
    const [listDetails, setListDetails] = useState({});
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/movieScraping');
        const { listDetails, moviesData } = response.data;

        setListDetails(listDetails);
        setMovies(moviesData);


      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
          setLoading(false); // Update loading status once data fetching is complete
      }
    };

    

    fetchData();
  }, []);

  return (
    <div>
        <h2>{listDetails.title}</h2>
        <p>{listDetails.description}</p>

        {loading ? (
                <p>Loading...</p> // Show loading indicator while data is being fetched
            ) : (
              <div className="movies-container">
                  {movies.map((movie, index) => (
                      <div key={index} className="movie">
                          <a href={`https://letterboxd.com${movie.title}`} target="_blank" rel="noopener noreferrer">
                              <img
                                        src={placeholderImage}
                                        data-src={movie.imageUrl} // Lazy load image
                                        alt={movie.title}
                                        className="lazy-load"
                                    />
                              </a>
                      </div>
                  ))}
              </div>
            )}
    </div>
);
}
  
  export default Movies;