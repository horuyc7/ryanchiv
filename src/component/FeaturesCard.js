import React from "react";
import "./FeaturesCard.css"

export default function FeaturesCard() {
  return (
    <div className="features-card">
      <div className="features-card-header">Future Features</div>
      <div className="features-card-body">
        <ul className="features-card-items">
          <li className="feature-item">Custom filter for spotify</li>
          
          <li className="feature-item">Make Travel dynamic, use google photos API</li>
          <li className="feature-item">Show photo locations, drives API</li>
          <li className="feature-item">Favorite foods</li>
          <li className="feature-item">Favorite restaurants, places API</li>
          <li className="feature-item">S̶e̶t̶ ̶u̶p̶ ̶s̶p̶o̶t̶i̶f̶y̶ ̶a̶u̶t̶h̶o̶r̶i̶z̶a̶t̶i̶o̶n̶</li>
          <li className="feature-item" >S̶k̶i̶l̶l̶s̶</li>
          <li className="feature-item">M̶a̶n̶g̶a̶ p̶l̶a̶n̶ t̶o̶ r̶e̶a̶d̶</li>
        </ul>
      </div>
    </div>
  );
}