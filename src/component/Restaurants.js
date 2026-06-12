import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import stores from "../data/stores.json";

import '../css/Restaurants.css';

import L from "leaflet";
import { useMap } from "react-leaflet";

const createColoredIcon = (color) =>
  new L.DivIcon({
    className: "restaurants__marker",
    html: `
      <div class="restaurants__marker-wrapper">
        <div class="restaurants__marker-dot" style="background:${color}"></div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

// Auto map bounds
function FitBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    if (!places.length) return;

    const bounds = L.latLngBounds(
      places.map((p) => [p.lat, p.lng])
    );

    map.fitBounds(bounds, {
  paddingTopLeft: [0, -450],
});
  }, [places, map]);

  return null;
}

export default function Restaurants() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStores =
    selectedCategory === "all"
      ? stores
      : stores.filter((r) => r.category === selectedCategory);

  return (
    <div className="restaurants">
      {/* FILTER */}
      <div className="restaurants__filters">
        {["all", "restaurant", "cafe", "bakery"].map((type) => (
          <button
            key={type}
            className={`restaurants__filter-btn ${
              selectedCategory === type
                ? "restaurants__filter-btn--active"
                : ""
            }`}
            onClick={() => setSelectedCategory(type)}
          >
            {type === "all"
              ? "All"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* MAP */}
      <MapContainer
        center={[0, -160]}
        zoom={3}
        className="restaurants__map"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap © CARTO"
        />

        <FitBounds places={filteredStores} />

        {filteredStores.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={createColoredIcon("#8be4a9")}
          >
            <Popup className="restaurants__popup" maxWidth={280}>
              <div className="restaurants__popup-content">

                <img
                  className="restaurants__popup-image"
                  src={r.image}
                  alt={r.name}
                />

                <h3 className="restaurants__popup-title">
                  {r.name}
                </h3>

                <div className="restaurants__popup-rating">
                  ⭐ {r.rating}/5
                </div>

                <div className="restaurants__popup-address">
                  📍 {r.address}
                </div>

                <p className="restaurants__popup-review">
                  - {r.review}
                </p>

                <a
                  className="restaurants__popup-link"
                  href={r.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps →
                </a>

              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}