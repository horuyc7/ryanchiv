import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
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

  /*
  const observer = useRef(null);
  useEffect(() => {
    if (!loading) {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    observer.current.unobserve(lazyImage);
                }
            });
        });

        // Start observing each lazy-load image
        document.querySelectorAll('.lazy-load').forEach((img) => {
            observer.current.observe(img);
        });
    }
}, [loading]); */

  return (
    <div className='movies'>
        <h2 className ="list-name"> {listDetails.title}</h2>
        <p className ="list-description">{listDetails.description}</p>

        {loading ? (
                <p>Loading...</p> // Show loading indicator while data is being fetched
            ) : (
              <div className="movies-container">
                  {movies.map((movie, index) => (
                      <div key={index} className="movie">
                          <a href={`https://letterboxd.com${movie.title}`} target="_blank" rel="noopener noreferrer">
                              <img
                                        src={movie.imageUrl} // Lazy load image
                                        alt={movie.title}
                              
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