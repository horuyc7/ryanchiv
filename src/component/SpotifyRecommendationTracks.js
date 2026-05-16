import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';
import LoadingCircle from './LoadingCircle';

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

async function fetchLastFm(endpoint) {
  const res = await fetch(endpoint);
  return await res.json();
}


export default function SpotifyRecommendationTracks() {

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('input');
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  
  const [recommendation, setRecommendation] = useState([]);

  const [accessToken, setAccessToken] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [artistIds, setArtistIds] = useState([]);

  //get and set spotify token on launch of this page
  useEffect(() => {

    async function fetchAndSetToken() {

      try {
      
        const token = await FetchSpotifyToken();

        setAccessToken(token);

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

  
  //when input is clicked
  const handleInputClick = async () => {

    setLoading(true);
    setIsError(false);

    //if noting is in text box, show existing input
    if(inputValue === '' && artistIds.length <= 0)
    {
      setIsError(true);
      setActiveSection('input');
      setLoading(false);
      setErrorText('No Input')
    }
    else
    {
      try {

    
        
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
          setIsError(false);
          setActiveSection('input');
      }
    };
  }


  const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

  const handleGetClick = async () => {

    setIsError(false);
    setLoading(true);
    setRecommendation([]);
    
    if (artistIds.length === 0) {
      setIsError(true);
      setErrorText('No artist(s) added');
      setLoading(false);
      return;
    }

    try {

      let allTracks = [];

      for (const artist of artistIds) {

        // get similar artists from Last.fm
        const similarEndpoint =
          `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar` +
          `&artist=${encodeURIComponent(artist.name)}` +
          `&api_key=${LASTFM_API_KEY}` +
          `&format=json` +
          `&limit=10`;

        const similarResponse = await fetchLastFm(similarEndpoint);

        const similarArtists =
          similarResponse?.similarartists?.artist || [];

        // take top similar artists
        for (const similarArtist of similarArtists.slice(0, 5)) {

          // search spotify tracks from similar artist
          const spotifyEndpoint =
            `v1/search?q=${encodeURIComponent(similarArtist.name)}` +
            `&type=track&limit=2`;

          const spotifyResponse = await fetchWebApi(
            spotifyEndpoint,
            'GET',
            accessToken
          );

          const tracks = spotifyResponse?.tracks?.items || [];

          allTracks.push(...tracks);
        }
      }

      // remove duplicate tracks
      const uniqueTracks = allTracks.filter(
        (track, index, self) =>
          index === self.findIndex((t) => t.id === track.id)
      );

      setRecommendation({
        tracks: uniqueTracks.slice(0, 10),
      });

      setActiveSection('get');

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setIsError(true);
      setErrorText('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='spotify-recommendation-tracks'> 
      <div className="spotify-recommendation-tracks__input-container">

            <input className='textbox' type="text" maxLength="30" placeholder="Input Artists (max 5) " value={inputValue} onChange={handleInputChange} />
            <button className="input-button" onClick={handleInputClick}>Input</button>   
      </div>



      <div className='spotify-recommendation-tracks__sliders-wrapper'>

        <div className='spotify-recommendation-tracks__sliders' > 

        </div>

      </div>
      

      <div className="spotify-recommendation-tracks__get-container">
        <button className="getrec-button" onClick={handleGetClick}>Get Rec</button>
      </div>


      { isError ?(
        <p className='error'>{errorText}</p>
      ) : (
        <p></p>)}
      

      

      { loading ? (

        <div className='loading'>
            <LoadingCircle/>
        </div>

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

            {recommendation && activeSection === 'get' && (
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

