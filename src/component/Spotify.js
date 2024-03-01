import React, { useState, useEffect } from 'react';
import "./Spotify.css";

async function fetchAccessToken() {
  const response = await fetch('/api/spotifyToken2'); // Make request to serverless function endpoint
  const data = await response.json();
  return data.access_token; // Extract access token from response
}

async function fetchWebApi(endpoint, method, body) {
  const accessToken = await fetchAccessToken();

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function getShortTermTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=10', 'GET'
  )).items;
}

async function getMediumTermTracks() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
      'v1/me/top/tracks?time_range=medium_term&limit=10', 'GET'
    )).items;
}



export default function Spotify() {
    const [shortTermTracks, setShortTermTracks] = useState([]);
    const [mediumTermTracks, setMediumTermTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('currentlyReading');
  
    useEffect(() => {
      async function fetchAndSetTopTracks() {
        try {
          const shortTermTracks = await getShortTermTracks();
          const mediumTermTracks = await getMediumTermTracks();

          setShortTermTracks(shortTermTracks);
          setMediumTermTracks(mediumTermTracks);

          setLoading(false);


        } catch (error) {
          console.error('Error fetching top tracks:', error);
          setLoading(false);
        }
      }
  
      fetchAndSetTopTracks();
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
          <p onClick={() => handleSectionClick('shortTerm')} className={activeSection === 'shortTerm' ? 'active' : ''}>Top Tracks (last 4 weeks)</p>
          <p onClick={() => handleSectionClick('mediumTerm')} className={activeSection === 'mediumTerm' ? 'active' : ''}>Top Tracks (last 6 months)</p>
        </div>
      )}
  
      <div className="spotify-container">
        {activeSection === 'shortTerm' && (
          <div className="shortTerm">
            {shortTermTracks.map((track, index) => (
              <div className="ST" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                 <p style={{ fontSize: '18px', fontWeight: '500', marginRight: '20px' }}>{index + 1}</p> {/* Add index here */}
                
                 <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <img style={{ marginRight: '20px', width: '100px', height: '100px'}} src={track.album.images[1].url} alt={track.name} />
                    
                 </a>
                
                <div>
                  <p style={{fontSize: '18px', fontWeight: '500'}}>{track.name}</p>
                  <p style={{fontSize: '18px', fontWeight: '500'}}>{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeSection === 'mediumTerm' && (
          <div className="mediumTerm">
            {mediumTermTracks.map((track, index) => (
              <div className="MT" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                 <p style={{ fontSize: '18px', fontWeight: '500', marginRight: '20px' }}>{index + 1}</p> {/* Add index here */}
                
                 <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <img style={{ marginRight: '20px', width: '100px', height: '100px'}} src={track.album.images[1].url} alt={track.name} />
                    
                 </a>
                
                <div>
                  <p style={{fontSize: '18px', fontWeight: '500'}}>{track.name}</p>
                  <p style={{fontSize: '18px', fontWeight: '500'}}>{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);
}