import React, { useState, useEffect } from 'react';
import './Manga.css';


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

    useEffect(() => {
        const fetchData = async () => {
        try {

            const response = await getManga(activeSection);

            console.log(response.data);

            setMangaList(response.data);

            

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

    

    fetchData();
  }, [activeSection]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    };


return (
    <div>
            <div className="section-container">
                <p onClick={() => handleSectionClick('reading')} className={activeSection === 'reading' ? 'active' : ''}>Currently Reading</p>
                <p onClick={() => handleSectionClick('completed')} className={activeSection === 'completed' ? 'active' : ''}>Completed</p>
                <p onClick={() => handleSectionClick('plan_to_read')} className={activeSection === 'plan_to_read' ? 'active' : ''}>Plan to Read</p>
            </div>

            <div className="manga-container">
                {activeSection === 'reading' && (
                    mangalist.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net/manga/${manga.node.id}`}target="_blank" rel="noopener noreferrer">
                                <img src={manga.node.main_picture.large} alt={manga.node.title} />
                            </a>

                            <p>{manga.node.title}</p>
                        </div>
                    ))
                )}

                {activeSection === 'completed' && (
                    mangalist.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net/manga/${manga.node.id}`}target="_blank" rel="noopener noreferrer">
                                <img src={manga.node.main_picture.large} alt={manga.node.title} />
                            </a>

                            <p className="score" style={{ marginTop: '5px', textAlign: 'center' }}> ☆ {manga.list_status.score}</p>
                        </div>
                    ))
                )}

                {activeSection === 'plan_to_read' && (
                    mangalist.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net/manga/${manga.node.id}`}target="_blank" rel="noopener noreferrer">
                                <img src={manga.node.main_picture.large} alt={manga.node.title} />
                            </a>

                            <p>{manga.node.title}</p>
                        </div>
                    ))
                )}
            </div>
    </div>
);
}
  
export default Manga;