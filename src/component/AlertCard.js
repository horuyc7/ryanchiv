import React, { useState } from "react";

export default function AlertCard({ breachedAccounts }) {
  const [disableChangePassword, setDisableChangePassword] = useState(false);

  const handleDismissAlert = () => {
    // Dismiss the alert and return it to the normal state
    setDisableChangePassword(true);
  };

  return (
    <div className={`card alert-card ${breachedAccounts && !disableChangePassword ? 'alert-card-red' : ''}`}>
      <div className="card-header alert-card-header">Alert</div>
      <div className="alert-card-content">
        {breachedAccounts && !disableChangePassword ? (
          <React.Fragment>
            <p>Your email was involved in a breach on the following sites:</p>
            <ul>
              {breachedAccounts.map(breach => (
                <li key={breach.id}>{breach.addedDate + ": " + breach.name}</li>
              ))}
            </ul>
            <div className="button-group">
              <button style={{ marginRight: '20px' }}>Change Password</button>
              <button onClick={handleDismissAlert}>Dismiss</button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p>No Alerts</p>
          </React.Fragment>
        )}
      
      </div>
    </div>
  );
}