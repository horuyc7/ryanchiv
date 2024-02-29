import React from "react";

export default function FeaturesCard() {
  return (
    <div className="features-card">
      <div className="features-card-header">Future Features</div>
      <div className="features-card-body">
        <ul className="features-card-items">
          <li className="feature-item">Set up spotify authorization</li>
          <li className="feature-item">Custom filter for spotify</li>
          <li className="feature-item">Skills/Tech</li>
          <li className="feature-item">Manga plan to read</li>
          <li className="feature-item">Make Travel dynamic, use google photos API</li>
          <li className="feature-item">Show photo locations, drives API</li>
          <li className="feature-item">Favorite foods</li>
          <li className="feature-item">Favorite restaurants, places API</li>
        </ul>
      </div>
    </div>
  );
}