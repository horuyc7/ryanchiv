import React, { useState, useEffect } from 'react';
import "./Spotify.css";

// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
/*
const token = 'BQAeRV4dbeXXaN52nlV2SWVLELafJY_Ida_5d08AJwpcihSUYhMIAHHiyyf9YMbvETQTd10AAKkLpczkzZEIvokwfw9QuyjzW5iCqhkrRwf2C83-ZSIsrHLKbnPn80WR7hf8Tnpqx62TnpHNkFjF5ccoYTnvLHdp_l34g6oULtg5yJjwepDS4lrTvUeCznyHoM-0UfQa6gA5tjiYrfsf8bkLtrXzJ2vodX0RSmyRj3w47X82p1H2jQT0BC8ORMso_GitFcU';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=10', 'GET'
  )).items;
}

export default function Spotify() {
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchAndSetTopTracks() {
        try {
          const tracks = await getTopTracks();
          setTopTracks(tracks);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching top tracks:', error);
          setLoading(false);
        }
      }
  
      fetchAndSetTopTracks();
    }, []);
  
    return (
      <div>
        <h2>Top Tracks (last 4 weeks) </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {topTracks.map((track, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img style={{ marginRight: '20px', width: '100px', height: '100px'}} src={track.album.images[1].url} alt={track.name} />
              <div>
                <p style={{fontSize: '18px', fontWeight: '500'}}>{track.name}</p>
                <p style={{fontSize: '18px', fontWeight: '500'}}>{track.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    ); */

const token = 'BQBbyabVZwchwFV39Yqt2guuM25G_xfvOv0SJuusIvozTPHuGd3MPJsmPClCjb09yJmI2Cc4-tFtFaXznsT5N4-CPyAqRmqnzrO7R-TKm3pVBrXbY864KoDfKKUV7SVn8Ka8tbudb9PZCvEEKsTfddTOXAjRc4qnfNlH2D8wOyC7lA4F74bunZA9EglYgKVXwYL7_nTGm3SSQx3YrVqpgn0YGEC5hg9zl20sdFPnPIWuwtnu7aspV7BJVYvZv_T6O-_5UfU';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
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