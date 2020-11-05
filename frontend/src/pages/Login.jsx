import React from 'react';
import { CreateAccount } from './CreateAccount';
import './Login.css';

/********************
 * Standard Login Page
 * Login using name, email, and password
 ********************/

 export class Login extends React.Component {

    state = {

      username: "",
      password: "",
      accountType: "",
      creatingAccount: false

    }

    render() {

      return (
      <div>
        {!this.state.creatingAccount && <div className="container">
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
          <div className="alert alert-danger" role="alert">Sample error -- for user doesnt exist or wrong password</div>
          <button className="btn btn-primary btn-block">Login</button>
          <span>Don't have an account? <a onClick={() => this.setState({creatingAccount: true})} href="#">Create account</a></span>
          </div>}
        {this.state.creatingAccount && <CreateAccount/>}

      </div>
    );

    }

 }