import React, { useState, useEffect } from 'react';
import authHelpers from './authHelpers';
import axios from 'axios';

import '../css/SpotifyTracks.css';


async function fetchWebApi(endpoint, method, accessToken) {

  if (!accessToken) {
    console.error("Spotify Token is not defined in the environment variables.");
  }

  //fetch from spotify with specific endpoint
  const response = await axios(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();

}


async function getTopTracks(accessToken, timeRange, limit) {

  //endpoint to get top tracks dynamically with range and limit
  const endpoint = `v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;

  //call fetch and return items array
  return (await fetchWebApi(endpoint, 'GET', accessToken)).items;

}



export default function SpotifyTracks() {

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('short_term');
  const [limit, setLimit] = useState('');
  const [accessToken, setAccessToken] = useState('');


  useEffect(() => {

    const token = authHelpers.getHashCode();

    if (token) {
      setAccessToken(token);
    } else {
      authHelpers.getAuth();
    }

  }, []);

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
    <div className='spotifytracks'>
      <div className='spotifytracks__input-container'>

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
        <button className="get-button" onClick={handleFetchClick}>Get</button>

      </div>


      <div className="spotifytracks__tracks">
        {tracks && tracks.map((track, index) => (
          <div className="track-container" key={index}>

            <p style={{ fontSize: '18px', fontWeight: '500', marginRight: '20px' }}>{index + 1}</p>

            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img style={{ marginRight: '20px', width: '100px', height: '100px' }} src={track.album.images[1].url} alt={track.name} />
            </a>

            <div>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>{track.name}</p>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}