import React, { useState, useEffect } from 'react';
import "./SpotifyPlaylist.css";

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

async function getPlaylist(accessToken) {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return await fetchWebApi(
    'v1/playlists/2ySWfzSMWPol6dyrVP8XF1?fields=description%2C+external_urls%2C+followers%2C+images%2C+owner%2C+name', 'GET', null, accessToken
  );
}

async function getPlaylistTracks(accessToken) {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return await fetchWebApi(
    'v1/playlists/2ySWfzSMWPol6dyrVP8XF1/tracks?fields=items%28track.name%2C+track.artists%2C+track.album.images%2C+track.external_urls%29&limit=5&offset=1759', 'GET', null, accessToken
  );
}

export default function SpotifyPlaylist() {
    const [playlist, setPlaylist] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');
  
    useEffect(() => {
      async function fetchAndSetPlaylists() {
        try {

          setLoading(true);
            if(activeSection === 'playlist')
            {
              const accessToken = await fetchAccessToken();

              console.log(accessToken);

                const playlist = await getPlaylist(accessToken);
                const playlistTracks = await getPlaylistTracks(accessToken);
                setPlaylist(playlist);
                setPlaylistTracks(playlistTracks);

                console.log(playlist);
                console.log(playlistTracks);

                setLoading(false);
                
  
            }

        } catch (error) {
          console.error('Error fetching playlists:', error);
          setLoading(false);
        }
  
      }
      fetchAndSetPlaylists();
    }, [activeSection]);
  
    const handleSectionClick = (section) => {
      setActiveSection(section);
    };
  
    return (
      <div>
        <div className="handle-container">
            <p onClick={() => handleSectionClick('playlist')} className={activeSection === 'playlist' ? 'active' : ''}>playlist</p>
          </div>


        {loading ? (
          <p>Loading...</p>
        ) : (
            <div className="playlist-container">
                <div className="playlists">
                    <div className="playlist">
                        <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                          <img style={{ marginRight: '20px', width: '100px', height: '100px' }} src={playlist.images[0].url} alt={playlist.name} />
                        </a>

                        <div>
                          <p style={{ fontSize: '18px', fontWeight: '500' }}>{playlist.name}</p>
                          <p style={{ fontSize: '18px', fontWeight: '500' }}>Likes: {playlist.followers.total}</p>
                        </div>
                    </div>
                </div>

    
                <div className="tracks" >
                  {playlistTracks.items.map((e, index) => (
                      <div key={index} className="track">

                        <a href={e.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                          <img src={e.track.album.images[0].url} alt={e.track.name} />
                        </a>

                        <div className='detail'>
                          <p>{e.track.name}</p>
                          <p>{e.track.artists[0].name}</p>
                        </div>
                      </div>
                    ))}

                </div>
            </div>
        )}
  
        
      </div>
    );
  }