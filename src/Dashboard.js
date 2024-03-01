import React from "react";
import FeaturesCard from "./component/FeaturesCard";
import Skills from "./component/Skills";
import "./styles.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      
      <div className="row mt-5">
          
        <div className="col-12">
          <FeaturesCard/>
          <Skills/>
        </div>
        
      </div>
    </div>
  );
}