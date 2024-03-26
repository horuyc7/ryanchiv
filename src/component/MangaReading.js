import React, { useState, useEffect } from 'react';

import '../css/MangaReading.css';

async function getMangaDetails(status) {
    try {
      const response = await fetch(`/api/mangaDetailsAPI?status=${status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching manga details data:', error.message);
      throw error;
    }
}

const MangaReading = ({ mangalist }) => {
    const [selectedManga, setSelectedManga] = useState(null);
    const [selectedMangaDetails, setSelectedMangaDetails] = useState(null);
    const [expandedSynopsis, setExpandedSynopsis] = useState(false);

    const handleMangaClick = (manga) => {
        setSelectedManga(manga);
        setExpandedSynopsis(false);
      };
    
    const closeModal = () => {
        setSelectedManga(null);
        setSelectedMangaDetails(null);
    };

    const toggleSynopsis = () => {
        setExpandedSynopsis(!expandedSynopsis);
    };


    useEffect(() => {
        const fetchMangaDetails = async () => {
            try {
            const response = await getMangaDetails(selectedManga.node.id);
            
            setSelectedMangaDetails(response);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
        fetchMangaDetails();
    }, [selectedManga]);


    useEffect(() => {
        const handleClickOutsideModal = (event) => {
            const modal = document.querySelector('.details');
            if (modal && !modal.contains(event.target)) {
            closeModal();
            }
        };
        
        document.body.addEventListener('mousedown', handleClickOutsideModal);
        
        return () => {
            document.body.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, []);

    return (
        <div className='mangareading'>
            {mangalist.map((manga, index) => (
                <div key={index} className="manga-container">
                    
                    <div key={index} className="manga" onClick={() => handleMangaClick(manga)}>
                        <img className='reading-img' src={manga.node.main_picture.large} alt={manga.node.title} />
                    </div>

                    <p>{manga.node.title}</p>
                </div>
            ))}

            {selectedMangaDetails && (
                    <div className="details">
                        <div className="details-content">
                            <span className="close" onClick={closeModal}>&times;</span>


                            <div className="details-container">
                                <a href={`https://myanimelist.net/manga/${selectedMangaDetails.id}`} target="_blank" rel="noopener noreferrer">
                                    <img className="details-image" src={selectedMangaDetails.main_picture.large} alt={selectedMangaDetails.title}/>
                                </a>

                                <div className='details-info'>
                                    <p className='details-title'>{selectedMangaDetails.title}</p>

                                    <p className='details-rating'>{selectedMangaDetails.mean}</p>

                                    <p className='details-genres'>{selectedMangaDetails.genres.map(genre => genre.name).join(', ')}</p>
                                </div>
                            </div>

                            <p className="synopsis" onClick={toggleSynopsis}>
                                {expandedSynopsis ? selectedMangaDetails.synopsis : selectedMangaDetails.synopsis.slice(0, 300) + '....'}
                            </p>

                    
                        </div>
                    </div>
                )}
        </div>
    );
}

export default MangaReading;