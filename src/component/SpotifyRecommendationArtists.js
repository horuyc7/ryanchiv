import React, { useState, useEffect } from 'react';
import './SpotifyRecommendationArtists.css';

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


async function getArtistId(endpoint, accessToken)
{
    return await fetchWebApi(
        endpoint, 'GET', null, accessToken
          );
}


export default function SpotifyRecommendation() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('input');
  const [inputValue, setInputValue] = useState('');
  const [artists, setArtists] = useState();
  const [accessToken, setAccessToken] = useState('');


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


    
    const handleGetClick = async () => {

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
    <div className='recommendation-artists'> 
      <div className="recommendation-artists-input-container">
              <input className='textbox' type="text" maxLength="30" placeholder="Input Artist" value={inputValue} onChange={handleInputChange} />
              <button className="get" onClick={handleGetClick}>Get</button>
              
      </div>


      {loading ? (
          <p></p>
        ) : (
          <div>
            {activeSection === 'get' && (
              <div className="artists">
                {artists.artists.map((artist, index) => (
                  <div key={index} className='artist'>
                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                      <img src={artist.images[0].url} alt={artist.name} />
                    </a>

                    <div className='artist-detail'>
                      <p>{artist.name}</p>
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

