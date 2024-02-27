import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Manga.css";

const Manga = () => {

    

    const [mangaData, setMangaData] = useState({ currently: [], completed: [] });
    const [activeSection, setActiveSection] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        if (activeSection !== '') {

            const fetchData = async () => {
                try {
                    const [currentlyResponse, completedResponse] = await Promise.all([
                        axios.get('/api/mangaCurrentlyScraping'),
                        axios.get('/api/mangaCompletedScraping')
                    ]);
                    setMangaData({ currently: currentlyResponse.data, completed: completedResponse.data });
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


    const observer = useRef(null);
  useEffect(() => {
    if (!loading) {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    observer.current.unobserve(lazyImage);
                }
            });
        });

        // Start observing each lazy-load image
        document.querySelectorAll('.lazy-load').forEach((img) => {
            observer.current.observe(img);
        });
    }
}, [loading]);


    return (
        <div>
            <div className="section-container">
                <p onClick={() => handleSectionClick('currently')} className={activeSection === 'currently' ? 'active' : ''}>Currently Reading</p>
                <p onClick={() => handleSectionClick('completed')} className={activeSection === 'completed' ? 'active' : ''}>Completed</p>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="manga-container">
                    {activeSection === 'currently' && mangaData.currently.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net${manga.title}`} target="_blank" rel="noopener noreferrer">
                                <img
                                                data-src={manga.imageUrl} // Lazy load image
                                                alt={manga.title}
                                                className="lazy-load"
                                            />
                            </a>
                        </div>
                    ))}
                    {activeSection === 'completed' && mangaData.completed.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net${manga.title}`} target="_blank" rel="noopener noreferrer">
                                <img
                                                data-src={manga.imageUrl} // Lazy load image
                                                alt={manga.title}
                                                className="lazy-load"
                                            />
                            </a>
                            <p style={{ marginTop: '5px', textAlign: 'center' }}> ☆ {manga.rating}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Manga;