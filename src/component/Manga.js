import React, { useState, useEffect } from 'react';
import MangaCompleted from './MangaCompleted';
import MangaPlan from './MangaPlan';
import MangaReading from './MangaReading';
import LoadingCircle from './LoadingCircle';

import '../css/Manga.css';


//fetch manga with active section
async function getManga(status) {
    try {

        const response = await fetch(`/api/mangaAPI?status=${status}`);

        return await response.json();
  
    } catch (error) {
      console.error('Error fetching manga data:', error.message);
      throw error;
    }
}


const Manga = () => {

    const [mangalist, setMangaList] = useState([]);
    const [activeSection, setActiveSection] = useState('reading');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const FetchAndSetData = async () => {
            try {

                setLoading(true);

                const response = await getManga(activeSection);

                setMangaList(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally{
                setLoading(false);
            }

        };

        FetchAndSetData();
  }, [activeSection]);


  //set current option when clicked
  const handleSectionClick = (section) => {
    setActiveSection(section);
    };


    return (
        <div className='manga'>

            <div className="manga__features">
                <p onClick={() => handleSectionClick('reading')} className={activeSection === 'reading' ? 'active' : ''}>Currently Reading</p>
                <p onClick={() => handleSectionClick('completed')} className={activeSection === 'completed' ? 'active' : ''}>Completed</p>
                <p onClick={() => handleSectionClick('plan_to_read')} className={activeSection === 'plan_to_read' ? 'active' : ''}>Plan to Read</p>
            </div>
        
            {loading ? (
                <div className='loading'>
                    <LoadingCircle/>
                </div>
             ) : (
                <div>
                    {activeSection === 'reading' && <MangaReading mangalist={mangalist} />}
                    {activeSection === 'completed' && <MangaCompleted mangalist={mangalist} />}
                    {activeSection === 'plan_to_read' && <MangaPlan mangalist={mangalist} />}
                </div>
            )}

        </div>
    );
}
  
export default Manga;