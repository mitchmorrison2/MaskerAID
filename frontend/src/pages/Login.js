import React from 'react';

/********************
 * Standard Login Page
 * Login using name, email, and password
 ********************/

 export class Login extends React.Component {

    state = {

        username: "",
        password: "",

    }

    render() {

        <div className="form-group col-md-6">

          <h1 className="">MaskerAid</h1>
          <label htmlFor="username">Username</label>
          <input className="form-control" type="text" name="username" id="username"/>
          <br/>
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" name="password" id="password"/>
          <br/>
          <label htmlFor="acct-type">Account type</label>
          <select className="form-control" id="account-type">
            <option></option>
            <option>Distributor</option>
            <option>Government</option>
            <option>etc etc...</option>
          </select>
          <button className="btn btn-primary btn-block">Login</button>
          <p>Don't have an account?</p>
        </div>

    }

 }