import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Manga.css";

const Manga = () => {
    const [currently, setCurrentlyReading] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [activeSection, setActiveSection] = useState('currentlyReading');

    useEffect(() => {
        const fetchData = async () => {
        try {
            const currentlyResponse = await axios.get('http://localhost:8000/scrap/manga/currently');
            setCurrentlyReading(currentlyResponse.data);

            const completedResponse = await axios.get('http://localhost:8000/scrap/manga/completed');
            setCompleted(completedResponse.data);

            console.log(completed);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

    

    fetchData();
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    };


return (
    <div>
            <div className="section-container">
                <p onClick={() => handleSectionClick('currently')} className={activeSection === 'currently' ? 'active' : ''}>Currently Reading</p>
                <p onClick={() => handleSectionClick('completed')} className={activeSection === 'completed' ? 'active' : ''}>Completed</p>
            </div>

            <div className="manga-container">
                {activeSection === 'currently' && (
                    currently.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net${manga.title}`} target="_blank" rel="noopener noreferrer">
                                <img src={manga.imageUrl} alt={manga.title} />
                            </a>
                        </div>
                    ))
                )}
                {activeSection === 'completed' && (
                    completed.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net${manga.title}`} target="_blank" rel="noopener noreferrer">
                                <img src={manga.imageUrl} alt={manga.title} />
                            </a>
                            <p style={{ marginTop: '5px', textAlign: 'center' }}> ☆ {manga.rating}</p>
                        </div>
                    ))
                )}
            </div>
    </div>
);
}
  
  export default Manga;