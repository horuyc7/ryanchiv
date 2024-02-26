import React from "react";
import TasksCard from "./component/TasksCard";
import AlertCard from "./component/AlertCard";
import "./styles.css";

export default function Dashboard({ auth }) {
  const hasBreaches = () => {
    return auth.meta && auth.meta.breachedAccounts && auth.meta.breachedAccounts.length > 0;
  };

  return (
    <div>
      <h2 className="mt-3">Dashboard</h2>
      <div className="row mt-5">
        <div className="col-12">
          <AlertCard breachedAccounts={hasBreaches() ? auth.meta.breachedAccounts : null} />
          <TasksCard />
        </div>
      </div>
    </div>
  );
}