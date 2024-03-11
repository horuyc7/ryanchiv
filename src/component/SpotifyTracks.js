import React, { useState, useEffect } from 'react';
import authHelpers from './authHelpers';

async function fetchWebApi(endpoint, method, body, accessToken) {

  if (!accessToken) {
    console.error("Spotify client ID is not defined in the environment variables.");
  } else {
    console.log("Spotify client IDk;kl;:", accessToken);
  }


      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await res.json();

}


async function getTopTracks(accessToken, timeRange, limit) {
  const endpoint = `v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
  return (await fetchWebApi(endpoint, 'GET', null, accessToken)).items;
}



export default function SpotifyTracks() {

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('short_term');
  const [limit, setLimit] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [clientId, setClientId] = useState();
  const [code, setCode] = useState();


  useEffect(() => {
    /*authHelpers.checkCookie();
    let hashCode = authHelpers.getHashCode();
    //let token = authHelpers.getCookie();
    
    if (!token && hashCode) {
      token = authHelpers.getHashCode();
    }
    else if (token && hashCode) {
      token = authHelpers.getHashCode();
    } */


    let token = authHelpers.getAuth();
    window.location.hash = "";
    if (token) {
        setAccessToken(token);
    }
    
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTopTracks(accessToken, timeRange, limit);
      setTracks(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


const handleTimeRangeChange = (event) => {
  setTimeRange(event.target.value);
};

const handleLimitChange = (event) => {
  setLimit(event.target.value);
};

const handleFetchClick = () => {
  if (limit && timeRange) {
      fetchData();
  }
};


return (
    <div>
       <div className="section-container">
                <p>
                    <label>
                        <input type="radio" value="short_term" checked={timeRange === 'short_term'} onChange={handleTimeRangeChange} />
                        Short Term
                    </label>
                </p>
                <p>
                    <label>
                        <input type="radio" value="medium_term" checked={timeRange === 'medium_term'} onChange={handleTimeRangeChange} />
                        Medium Term
                    </label>
                </p>
                <p>
                    <label>
                        <input type="radio" value="long_term" checked={timeRange === 'long_term'} onChange={handleTimeRangeChange} />
                        Long Term
                    </label>
                </p>
                <input className='textbox' type="text" maxLength="2" placeholder="Enter limit" value={limit} onChange={handleLimitChange} />
                <button className="fetch" onClick={handleFetchClick}>Get</button>
            </div>

    
        <div className="spotify-container">
                    {tracks && tracks.map((track, index) => (
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

    </div>
);
}