import React from 'react';
import '../css/MangaCompleted.css';

const MangaCompleted = ({ mangalist }) => {
    return (
        <div className='mangacompleted'>
            {mangalist.map((manga, index) => (
                <div key={index} className="manga-container">
                    
                    <a href={`https://myanimelist.net/manga/${manga.node.id}`} target="_blank" rel="noopener noreferrer">
                        <img className='completed-img'src={manga.node.main_picture.large}/>
                    </a>

                    <p className="score"> ☆ {manga.list_status.score}</p>
                </div>
            ))}
        </div>
    );
}

export default MangaCompleted;