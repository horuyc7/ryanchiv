import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./Manga.css";

const CLIENTID='d046c26ab619c40b8edb79ee90210538';
const CLIENTS='c685ab9acf741efec72db5efaf0f36a47ac670b9742f54da40a8ef8dfa0951e5';

const Manga = () => {

    

    const [mangaData, setMangaData] = useState({ currently: [], completed: [], plan: [] });
    const [activeSection, setActiveSection] = useState('currently');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (activeSection !== '') {

            const fetchData = async () => {

                try {
                    const response = await axios.get(`/api/manga${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}Scraping`);
                    setMangaData({ ...mangaData, [activeSection]: response.data });
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }

    }, [activeSection, mangaData]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setLoading(true);
    };

/*
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
}, [loading]); */

    return (
        <div>
            <div className="section-container">
                <p onClick={() => handleSectionClick('currently')} className={activeSection === 'currently' ? 'active' : ''}>Currently Reading</p>
                <p onClick={() => handleSectionClick('completed')} className={activeSection === 'completed' ? 'active' : ''}>Completed</p>
                <p onClick={() => handleSectionClick('plan')} className={activeSection === 'plan' ? 'active' : ''}>Plan to Read</p>
            </div>

            {loading ? (
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <p>Loading... web scraping :( </p>
                </div>
            ) : (
                <div className="manga-container">
                    {activeSection === 'currently' && mangaData.currently.map((manga, index) => (
                        <div key={index} className="manga">
                            <a href={`https://myanimelist.net${manga.title}`} target="_blank" rel="noopener noreferrer">
                                <img
                                                src={manga.imageUrl} // Lazy load image
                                                alt={manga.title}
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
                    {activeSection === 'plan' && mangaData.plan.map((manga, index) => (
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
                </div>
            )}
        </div>
    );
};

export default Manga;