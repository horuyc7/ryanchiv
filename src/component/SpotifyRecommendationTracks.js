import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';

import '../css/SpotifyRecommendationTracks.css';


async function fetchWebApi(endpoint, method, accessToken) {
  
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });
  return await res.json();
}


export default function SpotifyRecommendationTracks() {

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('input');
  const [inputValue, setInputValue] = useState('');
  const [artistIds, setArtistIds] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  //get and set spotify token on launch of this page
  useEffect(() => {

    async function fetchAndSetToken() {

      try {
      
        const token = await FetchSpotifyToken();

        setAccessToken(token);

      } catch (error) {
        console.error('Error fetching playlists:', error);
        setLoading(false);
      }

    }

    fetchAndSetToken();

  }, []);

    
  //set input value from user
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  
  //when input is clicked
  const handleInputClick = async () => {

    //if noting is in text box, show existing input
    if(inputValue === '')
    {
      setIsError(false);
      setActiveSection('input');
    }
    else
    {
      try {

        setIsError(false);
        setActiveSection('input');
        
        //create endpoint to retrieve artist
        const endpoint = `v1/search?q=${inputValue}&type=artist&limit=5`;

        //make request, get first artist from array of artists which is closest to input
        const response = await fetchWebApi(endpoint, 'GET', accessToken);
        const artist = response.artists.items[0];
        
        //if artist already exist in array
        if(artistIds.some((existingArtist) => existingArtist.id === artist.id))
        {
          setIsError(true);
          setErrorText('Artist already added, try again');
        }
        else
        {
          //add artist to array
          setArtistIds(prevArtist => [...prevArtist, artist]);
        }
        

        //reset text box
        setInputValue('');

      } catch (error) {
        console.error('Error fetching artists:', error);
      }
      finally
      {
          setLoading(false);
      }
    };
  }


  const handleGetClick = async () => {
      
    setIsError(false);

    //if array is not empty
    if(artistIds.length > 0)
    {
        try {

          //add all artist to recommendation parameter
          const seedArtists = artistIds.map((artist) => artist.id).join('%2C');
          const endpoint = `v1/recommendations?limit=10&seed_artists=${seedArtists}`;

          //request recommendation
          const response = await fetchWebApi(endpoint, 'GET', accessToken);
          
          
          if(response)
          {
            setRecommendation(response);
            setActiveSection('get');
          }
          

        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    }
    else
    {
      setIsError(true);
      setErrorText('No artist added');
    }
      
  }

  return (
    <div className='spotify-recommendation-tracks'> 
      <div className="spotify-recommendation-tracks__input-container">

              <input className='textbox' type="text" maxLength="30" placeholder="Input Artists (max 5) " value={inputValue} onChange={handleInputChange} />
              <button className="input-button" onClick={handleInputClick}>Input</button>
              
      </div>


      <div className="spotify-recommendation-tracks__get-container">
        <button className="getrec-button" onClick={handleGetClick}>Get rec</button>
      </div>


      { isError ?(
        <p className='error'>{errorText}</p>
      ) : (
        <p></p>)}
      

      { loading ? (
          <p></p>
        ) : (
          <div>
            {activeSection === 'input' && (
              <div className="spotify-recommendation-tracks__artists">
                {artistIds.map((id, index) => (
                  <div key={index} className='artist-container'>

                    <a href={id.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <img src={id.images[0].url} alt={id.name} />
                    </a>

                    <div className='artist-detail'>
                      <p>{id.name}</p>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {activeSection === 'get' && (
              <div className="spotify-recommendation-tracks__tracks">
                {recommendation.tracks.map((id, index) => (
                  <div key={index} className='track-container'>

                    <a href={id.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <img src={id.album.images[0].url} alt={id.name} />
                    </a>

                    <div className='track-detail'>
                      <p>{id.name}</p>
                      <p>{id.artists[0].name}</p>
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

