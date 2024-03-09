import React, { useState, useEffect } from 'react';
import './SpotifyRecommendation.css';

async function fetchAccessToken() {
  const response = await fetch('/api/spotifyTokenUnauthorize');
  const data = await response.json();
  return data.access_token;
}

  async function fetchWebApi(endpoint, method, body, accessToken) {
    
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      //body: JSON.stringify(body)
    });
    return await res.json();
  }

async function getArtist(endpoint, accessToken) {
  return await fetchWebApi(
endpoint, 'GET', null, accessToken
  );
}


export default function SpotifyRecommendation() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('input');
  const [inputValue, setInputValue] = useState('');
  const [artistIds, setArtistIds] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [already, setAlready] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    async function fetchAndSetSpotifyRecommendation() {
      try {
      
        const Token = await fetchAccessToken();

        setAccessToken(Token);

      } catch (error) {
        console.error('Error fetching playlists:', error);
        setLoading(false);
      }

    }
    fetchAndSetSpotifyRecommendation();

  }, []);

    

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };


    
    const handleInputClick = async () => {

      //if noting is in text box, do nothing
      if(inputValue === '')
      {
        setAlready(false);
        setActiveSection('input');
      }
      else
      {
        try {

          setAlready(false);
          setActiveSection('input');
          
          //create endpoint to retrieve artist
          const endpoint = `v1/search?q=${inputValue}&type=artist&limit=5`;

          //make request, get first artist from array of artists, closest to input
          const response = await getArtist(endpoint, accessToken);
          const artist = response.artists.items[0];
          
          //if artist already exist in array
          if(artistIds.some((existingArtist) => existingArtist.id === artist.id))
          {
              setAlready(true);
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


    const handleGetClick = async () =>
    {
        setAlready(false);

        //if array is not empty
        if(artistIds.length > 0)
        {
            try {

              //add all artist to recommendation parameter
              const seedArtists = artistIds.map((artist) => artist.id).join('%2C');
              const endpoint = `v1/recommendations?limit=10&seed_artists=${seedArtists}`;

              //request recommendation
              const response = await fetchWebApi(endpoint, 'GET', null, accessToken);
              
              
              if(response)
              {
                setActiveSection('get');
                setRecommendation(response);
              }
              
  
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        }
        else
        {
          setAlready(true);
          setErrorText('No artist added');
        }
        
    }

  return (
    <div className='recommendation'> 
      <div className="input-container">
              <input className='textbox' type="text" maxLength="30" placeholder="Input Artists (max 5) " value={inputValue} onChange={handleInputChange} />
              <button className="input" onClick={handleInputClick}>Input</button>
              
      </div>

      <div className="get-container">
        <button className="get" onClick={handleGetClick} >Get rec</button>
      </div>

      {already ?(
        <p className='errortext'>{errorText}</p>
      ) : (
        <p></p>)}
      


      {loading ? (
          <p></p>
        ) : (
          <div>
            {activeSection === 'input' && (
              <div className="artists">
                {artistIds.map((id, index) => (
                  <div key={index} className='artist'>
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
              <div className="tracks">
                {recommendation.tracks.map((id, index) => (
                  <div key={index} className='track'>
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

