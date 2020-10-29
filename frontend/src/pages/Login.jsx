import React from 'react';
import './Login.css';

/********************
 * Standard Login Page
 * Login using name, email, and password
 ********************/

 export class Login extends React.Component {

    state = {

      username: "",
      password: "",
      accountType: ""

    }

    render() {

      return (
      <div className="container">
        <label htmlFor="username">Username</label>
        <input className="form-control" 
          type="text" 
          name="username" 
          id="username"
          value={this.state.username}
          onChange={e => this.setState({username: e.target.value})}
        />
        <label htmlFor="password">Password</label>
        <input className="form-control" 
          type="password" 
          name="password" 
          id="password"
          value={this.state.password}
          onChange={e => this.setState({password: e.target.value})}
        />
        <label htmlFor="acct-type">Account type</label>
        <select className="form-control col-6" id="account-type"
          value={this.state.accountType}
          onChange={e => this.setState({accountType: e.target.value})}>

          <option></option>
          <option>Distributor</option>
          <option>Government</option>
          <option>etc etc...</option>
          
        </select>
        <button className="btn btn-primary btn-block">Login</button>
        <p>Don't have an account? <a href="">Create account</a></p>
      </div>
    );

    }

 }