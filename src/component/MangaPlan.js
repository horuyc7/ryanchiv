import React from 'react';

import '../css/MangaPlan.css';

const MangaPlan = ({ mangalist }) => {
    return (
        <div className='mangaplan'>
            {mangalist.map((manga, index) => (
                <div key={index} className="manga-container">

                    <a href={`https://myanimelist.net/manga/${manga.node.id}`} target="_blank" rel="noopener noreferrer">
                        <img className='plan-img' src={manga.node.main_picture.large} alt={manga.node.title} />
                    </a>

                    <p>{manga.node.title}</p>
                </div>
            ))}
        </div>
    );
}

export default MangaPlan;