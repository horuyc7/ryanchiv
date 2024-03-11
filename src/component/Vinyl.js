import React, { useState, useEffect } from 'react';
import './Vinyl.css';

async function getVinyl(status) {
    try {

    const response = await fetch('/api/discogAPI');

    if (!response.ok) {
        throw new Error('Failed to fetch vinyl data');
      }

    return await response.json();
  
    } catch (error) {
      console.error('Error fetching manga data:', error.message);
      throw error;
    }
  }


const Vinyl = () => {
    const [vinylList, setVinylList] = useState({ releases: [] });
    //const [activeSection, setActiveSection] = useState('reading');

    useEffect(() => {
        const fetchData = async () => {
        try {

            const response = await getVinyl();

            console.log(response);

            setVinylList(response);

            

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

    

    fetchData();
  }, []);


return (
    <div>
            <div className="vinyl-container">
                {vinylList && (
                    vinylList.releases.map((vinyl, index) => (
                        <div key={index} className="vinyl">
                            <a href={`https://discogs.com/release/${vinyl.id}`}target="_blank" rel="noopener noreferrer">
                                <img src={vinyl.basic_information.cover_image} alt={vinyl.basic_information.title} />
                            </a>
                            
                            <div className='vinyl-detail'>
                                <p>{vinyl.basic_information.title}</p>
                                <p>Artists: {vinyl.basic_information.artists[0].name}</p>
                                <p>Year: {vinyl.basic_information.year}</p>
                                <p>Genres: {vinyl.basic_information.genres.join(', ')}</p>
                            </div>
                        </div>
                    ))
                )}

            </div>
    </div>
);
}
  
export default Vinyl;