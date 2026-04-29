import Description from "./component/Description";
import Skills from "./component/Skills";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

        <div className="dashboard__components">
            <Description/>
            <Skills/>
        </div>
        
    </div>
  );
}