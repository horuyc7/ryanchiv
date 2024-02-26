import React from "react";

export default function TasksCard() {
  return (
    <div className="tasks-card">
      <div className="tasks-card-header">Upcoming Tasks</div>
      <div className="tasks-card-body">
        <ul className="tasks-card-items">
          <li className="list-group-item">Call Fran @ 10am</li>
          <li className="list-group-item">Prepare important customer report</li>
          <li className="list-group-item">1:1 meeting with Josh</li>
          <li className="list-group-item">Draft strategy for Q3</li>
        </ul>
      </div>
    </div>
  );
}