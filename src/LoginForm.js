import React, { useState } from "react";
import { sampleUsers, sampleBreaches } from "./data/sample-data";

/*******************************
 * Hardcoded Data for scenario *
 *******************************/

// Sample data has been imported per above. See the data file
// for more information.

/***********************
 * Business functions *
 ***********************/

// Takes a user and a boolean has_breaches value
// and returns the auth object corresponding with
// that user

function genHexString(length) {
    const characters = '0123456789abcdef';
    let hexString = '';
    for (let i = 0; i < length; i++) {
      hexString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hexString;
  }


function buildAuth(user, has_breaches) {
  if (has_breaches) {
    return {
      token: genHexString(16),
      user: user,
      meta: {
        suggestPasswordChange: true,
        breachedAccounts: sampleBreaches
      }
    };
  } else {
    return {
      token: genHexString(16),
      user: user
    };
  }
}

export default function LoginForm(props) {
  const [user, setUser] = useState({
    email: "",
    password: "",
    loginFailed: false
  });

  const updateLogin = (val) => {
    setUser({
      ...user,
      ...val
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // NOTE: Normally would be hooked up to the an API call to determine
    // if the particular email has breaches, but you should leave this
    // hard-coded data for now. We're mostly interested in the React
    // portion of this code.
    if (user.email === sampleUsers[0].email && user.password === sampleUsers[0].password) {
      setUser({
        ...user,
        loginFailed: false
      });
      // has no breaches
      props.onLoginSuccess(buildAuth(sampleUsers[0], false));
    } else if (user.email === sampleUsers[1].email && user.password === sampleUsers[1].password) {
      setUser({
        ...user,
        loginFailed: false
      });
      // has breaches
      props.onLoginSuccess(buildAuth(sampleUsers[1], true));
    } else {
      setUser({
        ...user,
        loginFailed: true
      });
    }
    return false;
  };

  return (
    <div>
      {user.loginFailed && (
        <div className="alert alert-danger mt-3">
          The email or password you provided is incorrect. Please check your entry and try again.
        </div>
      )}
      <div className="py-5 text-center">
        <h2>Sign In</h2>
      </div>
      <div>
        <form onSubmit={e => handleSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="email">Fav Manga</label>
            <div className="input-group">
              <input type="text" className="form-control" id="email" required onChange={e => updateLogin({ email: e.target.value })} value={user.email} />
            </div>
          </div>

          <div className="mb-3" style={{ marginTop: '10px' }}>
            <label htmlFor="password">Gov Fname</label>
            <div className="input-group">
              <input type="password" className="form-control" id="password" onChange={e => updateLogin({ password: e.target.value })} required />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: '10px' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}