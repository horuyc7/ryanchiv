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
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return await fetchWebApi(
endpoint, 'GET', null, accessToken
  );
}


export default function SpotifyRecommendation() {
    const [playlist, setPlaylist] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [artistIds, setArtistIds] = useState([]);
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
      async function fetchAndSetSpotifyRecommendation() {
        try {

          setLoading(true);
        
          const accessToken = await fetchAccessToken();

          setAccessToken(accessToken);
  

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
        try {
          const endpoint = `v1/search?q=${inputValue}&type=artist&limit=5`;
          const response = await getArtist(endpoint, accessToken);
          const artistIds = response.artists.items[0];

          console.log(artistIds);
          setArtistIds(prevArtistIds => [...prevArtistIds, artistIds]);
          setInputValue('');
        } catch (error) {
          console.error('Error fetching artists:', error);
        }
        finally
        {
            setLoading(false);
        }
      };
  
    return (
      <div>
        <div className="section-container">
                5 artists max
                <input className='textbox' type="text" maxLength="20" placeholder="Input Artists " value={inputValue} onChange={handleInputChange} />
                <button className="input" onClick={handleInputClick}>Input</button>
                <button className="fetch" >Get</button>
        </div>


        {loading ? (
          <p>Loading...</p>
        ) : (
            <div className="artists">
     
                    {artistIds.map((id, index) => (
                        <div key={index} className='artist'>
                            <a href={id.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <img src={id.images[0].url} alt={id.name} />
                            </a>
            
                            <div className='detail'>
                                <p>{id.name}</p>
                                <p>{id.id}</p>
                            </div>
                        </div>
                    ))}
            </div>
        )}
  
        
      </div>
    );
  }