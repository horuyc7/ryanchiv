import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Movies.css';

const Movies = () => {
    const [listDetails, setListDetails] = useState({});
    const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/scrap/movie');
        //setMovies(response.data);
        const { listDetails, moviesData } = response.data;
        setListDetails(listDetails);
        setMovies(moviesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    fetchData();
  }, []);

  return (
    <div>
        <h2>{listDetails.title}</h2>
        <p>{listDetails.description}</p>
        <div className="movies-container">
            {movies.map((movie, index) => (
                <div key={index} className="movie">
                    <a href={`https://letterboxd.com${movie.title}`} target="_blank" rel="noopener noreferrer">
                            <img src={movie.imageUrl} alt={movie.title} />
                        </a>
                </div>
            ))}
        </div>
    </div>
);
}
  
  export default Movies;