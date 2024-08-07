import React from "react";
import "../css/Hobbies.css"

export default function Hobbies() {
  return (
    <div className="hobbiescard">
        <div className="hobbiescard__header">Interests/Hobbies</div>

        <div className="hobbiescard__body">
            <ul className="hobbiescard__items">

                <li className="hobbiescard__item">Snooker</li>
                <li className="hobbiescard__item">Manga</li>
                <li className="hobbiescard__item">Movies</li>
                <li className="hobbiescard__item">Soccer</li>
                <li className="hobbiescard__item">Basketball</li>
                <li className="hobbiescard__item">Tennis</li>
                <li className="hobbiescard__item">Pickleball</li>
                <li className="hobbiescard__item">Video Games</li>
                <li className="hobbiescard__item">Cubing</li>
                <li className="hobbiescard__item">Coding</li>
                <li className="hobbiescard__item">Baking</li>
                <li className="hobbiescard__item">Video Editing</li>
                <li className="hobbiescard__item">Vinyl</li>
            </ul>
        </div>
    </div>
  );
}