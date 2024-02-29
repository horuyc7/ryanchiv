import React from "react";
import FeaturesCard from "./component/FeaturesCard";
import "./styles.css";

export default function Dashboard() {
  return (
    <div>
      <h2 className="mt-3">Dashboard</h2>
      
      <div className="row mt-5">
          
        <div className="col-12">
          <FeaturesCard/>
          
        </div>
      </div>
    </div>
  );
}