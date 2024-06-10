import React from "react";
import "../css/Hobbies.css"

export default function Hobbies() {
  return (
    <div className="hobbiescard">
        <div className="featurescard__header">Interests/Hobbies</div>

        <div className="featurescard__body">
            <ul className="featurescard_items">

                <li className="featurescard__item">Pool (Snooker, 9/10 ball, Straight)</li>
                <li className="featurescard__item">Manga</li>
                <li className="featurescard__item">Movies</li>
                <li className="featurescard__item">Soccer</li>
                <li className="featurescard__item">Basketball</li>
                <li className="featurescard__item">Tennis</li>
                <li className="featurescard__item">Pickleball</li>
                <li className="featurescard__item">Video Games</li>
                <li className="featurescard__item">Cubing</li>
                <li className="featurescard__item">Coding</li>
                <li className="featurescard__item">Baking</li>
                <li className="featurescard__item">Video Editing</li>
                <li className="featurescard__item">Vinyl</li>
            </ul>
        </div>
    </div>
  );
}