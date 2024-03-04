
import React, { useState, useEffect } from 'react';

async function fetchAccessToken() {
  const response = await fetch('/api/spotifyToken');
  const data = await response.json();
  return data.access_token;
}

async function fetchWebApi(endpoint, method, body) {
  const accessToken = await fetchAccessToken();

  try {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching data from Spotify API:', error);
    throw new Error('Failed to fetch data from Spotify API');
  }
}

async function getPlaylist() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return await fetchWebApi(
    'v1/playlists/2ySWfzSMWPol6dyrVP8XF1?fields=description%2C+external_urls%2C+followers%2C+images%2C+owner%2C+name', 'GET'
  );
}


export default function SpotifyPlaylist() {
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('currentlyReading');
  
    useEffect(() => {
      async function fetchAndSetPlaylists() {
        try {
          const playlist = await getPlaylist();
          setPlaylist(playlist);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching playlists:', error);
          setLoading(false);
        }
      }
      fetchAndSetPlaylists();
    }, []);
  
    const handleSectionClick = (section) => {
      setActiveSection(section);
    };
  
    return (
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="section-container">
            <p onClick={() => handleSectionClick('playlist')} className={activeSection === 'playlist' ? 'active' : ''}>playlist</p>
          </div>
        )}
  
        <div className="spotify-container">
        <div className="playlist">
          <div className="PL" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <a target="_blank" rel="noopener noreferrer">
              <img style={{ marginRight: '20px', width: '100px', height: '100px' }} src={playlist.images.url} alt={playlist.name} />
            </a>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>{playlist.name}</p>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>{playlist.followers.total}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }