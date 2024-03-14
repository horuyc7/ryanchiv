import React, { useState, useEffect } from 'react';
import FetchSpotifyToken from './FetchSpotifyToken';

import "../css/SpotifyPlaylist.css";

async function fetchWebApi(endpoint, method, accessToken) {
  
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
  });
  return await res.json();

}

async function getPlaylist(accessToken) {
  return await fetchWebApi(
    'v1/playlists/2ySWfzSMWPol6dyrVP8XF1?fields=description%2C+external_urls%2C+followers%2C+images%2C+owner%2C+name', 'GET', accessToken
  );
}

async function getPlaylistTracks(accessToken) {
  return await fetchWebApi(
    'v1/playlists/2ySWfzSMWPol6dyrVP8XF1/tracks?fields=items%28track.name%2C+track.artists%2C+track.album.images%2C+track.external_urls%29&limit=5&offset=1765', 'GET', accessToken
  );
}

export default function SpotifyPlaylist() {

    const [playlist, setPlaylist] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchAndSetPlaylists() {
        try {

              setLoading(true);
 
              const accessToken = await FetchSpotifyToken();

              const playlist = await getPlaylist(accessToken);

              const playlistTracks = await getPlaylistTracks(accessToken);

              setPlaylist(playlist);
              setPlaylistTracks(playlistTracks);

              
      
        } catch (error) {
          console.error('Error fetching playlists:', error);
          setLoading(false);
        }
        finally {
          setLoading(false);
        }
  
      }

      fetchAndSetPlaylists();

    }, []);
  
  
    return (
      <div>

        {loading ? (
          <p>Loading...</p>
        ) : (
            <div className="spotify-playlist">
                <div className="spotify-playlist__playlists">
                    <div className="playlist-container">

                        <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                          <img style={{ marginRight: '20px', width: '100px', height: '100px' }} src={playlist.images[0].url} alt={playlist.name} />
                        </a>

                        <div>
                          <p style={{ fontSize: '18px', fontWeight: '500' }}>{playlist.name}</p>
                          <p style={{ fontSize: '18px', fontWeight: '500' }}>Likes: {playlist.followers.total}</p>
                        </div>

                    </div>
                </div>

    
                <div className="spotify-playlist__tracks" >
                  {playlistTracks.items.map((e, index) => (
                      <div key={index} className="track-container">

                        <a href={e.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                          <img src={e.track.album.images[0].url} alt={e.track.name} />
                        </a>

                        <div className='track-detail'>
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