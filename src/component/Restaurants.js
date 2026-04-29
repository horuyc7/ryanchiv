import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import stores from "../data/stores.json";

import '../css/Restaurants.css';

import L from "leaflet";
import { useMap } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const createColoredIcon = (color) => {
  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
      ">
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

function FitBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(
      places.map(p => [p.lat, p.lng])
    );

    map.fitBounds(bounds);
  }, [places]);

  return null;
}

const defaultIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [22, 34],
  iconAnchor: [12, 41],
});

export default function Restaurants(){

    const [loading, setLoading] = useState(true);
    const [showIframe, setShowIframe] = useState(false);


    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredStores =
  selectedCategory === "all"
    ? stores
    : stores.filter(r => r.category === selectedCategory);


    return(
        <div className="restaurants">

            <div className="filter-buttons">
                <button
                    className={selectedCategory === "all" ? "active" : ""}
                    onClick={() => setSelectedCategory("all")}
                >
                    All
                </button>

                <button
                    className={selectedCategory === "restaurant" ? "active" : ""}
                    onClick={() => setSelectedCategory("restaurant")}
                >
                    Restaurants
                </button>

                <button
                    className={selectedCategory === "cafe" ? "active" : ""}
                    onClick={() => setSelectedCategory("cafe")}
                >
                    Cafes
                </button>

                <button
                    className={selectedCategory === "bakery" ? "active" : ""}
                    onClick={() => setSelectedCategory("bakery")}
                >
                    Bakery
                </button>
            </div>

            <MapContainer center={[0, -160]} zoom={3} style={{ height: "100vh", width: "100%" }}>
                <FitBounds places={filteredStores} />
                <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap © CARTO"
                />

                {filteredStores.map(r => (
                    <Marker
                        key={r.id}
                        position={[r.lat, r.lng]}
                        icon={createColoredIcon("#8be4a9")}
                    >

                <Popup maxWidth={280} offset={[5, 5]} className="custom-popup">
                    <div style={{ width: "240px" }}>

                    {/* Image */}
                    <img
                    src={r.image}
                    alt={r.name}
                    style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px"
                    }}
                    />

                    <h3 style={{ margin: "0 0 5px 0" }}>{r.name}</h3>

                    <div style={{ marginBottom: "5px" }}>
                    ⭐ {r.rating}/5
                    </div>

                    <div style={{ fontSize: "12px", color: "#ffffff", marginBottom: "5px" }}>
                    📍 {r.address}
                    </div>

                    <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                    - {r.review}
                    </p>

                    <a
                    href={r.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#8be4a9",
                        fontSize: "13px",
                        textDecoration: "none"
                    }}
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