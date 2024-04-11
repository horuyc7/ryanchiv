import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';
import LoadingCircle from './LoadingCircle';

import '../css/SpotifyRecommendationArtists.css';


async function fetchWebApi(endpoint, method, accessToken) {
  
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });
  return await res.json();
}

async function getArtist(endpoint, accessToken) {
  return await fetchWebApi(endpoint, 'GET', accessToken);
}

async function getArtistId(endpoint, accessToken) {
  return await fetchWebApi(endpoint, 'GET', accessToken);
}

export default function SpotifyRecommendation() {

  const [loading, setLoading] = useState();
  const [activeSection, setActiveSection] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [artist, setArtist] = useState();
  const [artists, setArtists] = useState();
  const [accessToken, setAccessToken] = useState('');


  //get and set spotify token on launch of this page
  useEffect(() => {
    async function fetchAndSetToken() {
      try {
      
        const Token = await FetchSpotifyToken();

        setAccessToken(Token);

      } catch (error) {
        console.error('Error fetching Token:', error);
        setLoading(false);
      }

    }
    fetchAndSetToken();

  }, []);

    
  //set input value from user
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


    
  const handleGetClick = async () => {

    setLoading(true);
    
    //if noting is in text box, do nothing
    if(inputValue === '')
    {
      setLoading(true);
      setActiveSection('');
    }
    else
    {
      try {

        //create endpoint to retrieve artist id
        const endpoint = `v1/search?q=${inputValue}&type=artist&limit=5`;
        const response = await getArtistId(endpoint, accessToken);

        //create endpoint to retrieve related artists
        const endpoint2 = `v1/artists/${response.artists.items[0].id}/related-artists`;
        const response2 = await getArtist(endpoint2, accessToken);


        setArtist(response);
        setArtists(response2);


        //reset text box
        setInputValue('');

      } catch (error) {
        console.error('Error fetching artists:', error);
      }
      finally
      {
          setLoading(false);
          setActiveSection('get');
      
      }
    };
  }


  return (
    <div className='spotify-recommendation-artists'> 
      <div className="spotify-recommendation-artists__input-container">

              <input className='textbox' type="text" maxLength="30" placeholder="Input Artist" value={inputValue} onChange={handleInputChange} />
              <button className="get-button" onClick={handleGetClick}>Get</button>
              
      </div>


      {loading ? (

          <div className='loading'>
            <LoadingCircle/>
          </div>

        ) : (
          <div>
            {activeSection === 'get' && (
              
              <div className="spotify-recommendation-artists__artists">
                
                <div className='artist-container'>

                    <a href={artist.artists.items[0].external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <img src={artist.artists.items[0].images[0].url} alt={artist.artists.items[0].name} />
                    </a>

                    <div className='artist-detail'>
                      <p className='name'>{artist.artists.items[0].name}</p>

                      <p className="genres">Genres: {artist.artists.items[0].genres.join(', ')}</p>
                    </div>
                </div>
                
                
                
                {artists.artists.map((artist, index) => (
                  <div key={index} className='artists-container'>

                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <img src={artist.images[0].url} alt={artist.name} />
                    </a>

                    <div className='artists-detail'>
                      <p className='name'>{artist.name}</p>

                      <p className="genres">Genres: {artist.genres.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>

            )}
          </div>
        )}
    </div>
  )
}

