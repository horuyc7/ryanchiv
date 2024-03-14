import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';

import '../css/Movies.css'

const Movies = () => {

  const [listDetails, setListDetails] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {

        //call api
        const response = await axios.get('/api/movieScraping');

        //save response
        const { listDetails, moviesData} = response.data;
        setMovies(moviesData);
        setListDetails(listDetails);


      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
          setLoading(false);
      }
    };

    fetchAndSetData();
  }, []);


  return (
    <div className='movies'>

        <div className='movies__detail'>
          <h2 className ='movies__list-title'> {listDetails.title}</h2>
          <p className ='movies__list-description'>{listDetails.description}</p>
        </div>

        
        { loading ? (
                <p className='loading'>Loading...</p>
            ) : (
              <div className='movies__movies'>
                  {movies.map((movie, index) => (
                      <div key={index} className="movie-container">
                          <a href={`https://letterboxd.com${movie.href}`} target="_blank" rel="noopener noreferrer">
                              <img src={movie.imageUrl} alt={movie.href}/>
                            </a>
                      </div>
                  ))}
              </div>
            )}
    </div>
  );
}
  
  export default Movies;