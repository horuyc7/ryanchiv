import React, { useState, useEffect } from 'react';
import "./Spotify.css";

async function fetchSpotifyClientId() {
  try {
    const response = await fetch('/api/SpotifyClientID');
    const data = await response.json();
    console.log('Response:', data); // Log the response
    return data.clientId;
  } catch (error) {
    console.error('Error fetching Spotify client ID:', error);
    return null;
  }
}

const clientId = await fetchSpotifyClientId();
//const clientId = '6198fcf6f4eb4eda9e9bca8527177fd4';
//const accessToken = 'BQAKSb9hO5WOOZk2WhYPy3UdGlshnd1p7vK8d_2rvYvl1UFy67Q7DBDZI_rsQ7wzaJITyODR6zswtAciuk1Q8It5rFZc60smnGNQMODWbHLk9qNUcDJIU_55jmoFRh-A1M0QneDtwd4gI2PHNgsmT02HErBcFqtf8CfD50HN6VPUfJv1SXxuIN3k4mnl';
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function redirectToAuthCodeFlow() {

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/spotify");
    params.append("scope", "user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function getAccessToken() {

    if (!code) {
        redirectToAuthCodeFlow(clientId);
    }

    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/spotify");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();

    return access_token;
}

/*
async function fetchAccessToken() {
  const response = await fetch('/api/spotifyToken2'); // Make request to serverless function endpoint
  const data = await response.json();
  return data.access_token; // Extract access token from response
} */

async function fetchWebApi(endpoint, method, body) {

  //const clientId = '6198fcf6f4eb4eda9e9bca8527177fd4';
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.error("Spotify client ID is not defined in the environment variables.");
  } else {
    console.log("Spotify client IDk;kl;:", accessToken);
  }

  
  
  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {

      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      body: JSON.stringify(body)
    });

    return await res.json();

  }
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

async function getTopTracks(timeRange, limit) {
  const endpoint = `v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
  return (await fetchWebApi(endpoint, 'GET')).items;
}



export default function Spotify() {

    //const [tracksData, setTracksData] = useState({ shortTermTracks: [], mediumTermTracks: []});
    
    const [shortTermTracks, setShortTermTracks] = useState();
    const [mediumTermTracks, setMediumTermTracks] = useState();
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');
 
/*
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('');
    const [limit, setLimit] = useState(''); */

    useEffect(() => {

      if (activeSection !== '') {

        const fetchData = async () => {
          try {
            let response;
            if (activeSection === 'shortTermTracks') {
              response = await getShortTermTracks();
              setShortTermTracks(response); // Update shortTermTracks state

            }
            else if (activeSection === 'mediumTermTracks') {
              response = await getMediumTermTracks();
              setMediumTermTracks(response); // Update shortTermTracks state

            } 
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };

          fetchData();
      }

  }, [activeSection]);

    const handleSectionClick = (section) => {
      setActiveSection(section);
  };

return (
    <div>
      <div className="section-container">
          <p onClick={() => handleSectionClick('shortTermTracks')} className={activeSection === 'shortTermTracks' ? 'active' : ''}>Top Tracks (last 4 weeks)</p>
          <p onClick={() => handleSectionClick('mediumTermTracks')} className={activeSection === 'mediumTermTracks' ? 'active' : ''}>Top Tracks (last 6 months)</p>
        </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Loading... </p>
       </div>
      ) : (
        <div className="spotify-container">
        {activeSection === 'shortTermTracks' && (
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
        
        {activeSection === 'mediumTermTracks' && (
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
        
      )}
  
      
    </div>
);
}