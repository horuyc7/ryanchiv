import React from "react";
import FeaturesCard from "./component/FeaturesCard";
import Skills from "./component/Skills";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

        <h2 className="dashboard__header">Dashboard</h2>
    
        <div className="dashboard__components">
            <FeaturesCard/>
            <Skills/>
        </div>
        
    </div>
  );
}