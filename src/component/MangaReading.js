import React from 'react';

import '../css/MangaReading.css';

const MangaReading = ({ mangalist }) => {
    return (
        <div className='mangareading'>
            {mangalist.map((manga, index) => (
                <div key={index} className="manga-container">
                    
                    <a href={`https://myanimelist.net/manga/${manga.node.id}`} target="_blank" rel="noopener noreferrer">
                        <img className='reading-img' src={manga.node.main_picture.large} alt={manga.node.title} />
                    </a>

                    <p>{manga.node.title}</p>
                </div>
            ))}
        </div>
    );
}

export default MangaReading;