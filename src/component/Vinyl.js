import React, { useState, useEffect } from 'react';
import Loading from './Loading';

import '../css/Vinyl.css';

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
    const [loading, setLoading] = useState(false);
    const [vinylList, setVinylList] = useState({ releases: [] });

    useEffect(() => {
        setLoading(true);

        const fetchVinyl = async () => {

            try {

                const response = await getVinyl();

                setVinylList(response);
                

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchVinyl();

    }, []);


    return (
        <div className='vinyl'>
        
            
            

            {loading ? (
                <div className='loading'>
                    <Loading/>
                </div>
            ) : (
            <div className="vinyl__vinyls">

            <h2 className='vinyl__header'> Collection </h2>

                {vinylList && (
                    vinylList.releases.map((vinyl, index) => (
                        <div key={index} className="vinyl-container">
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

            )}          
        </div>
       

    );
}
  
export default Vinyl;