import axios from 'axios';
import React from 'react';
import { CreateAccount } from './CreateAccount';
import {Link} from 'react-router-dom';
import './Login.css';

/********************
 * Standard Login Page
 * Login using name, email, and password
 ********************/

 export class Login extends React.Component {

    state = {

      email: "",
      password: "",
      accountType: "",
      creatingAccount: false

    }

    handleLogin = () => {

      axios.post("lab-db.ca2edemxewbg.us-east-1.rds.amazonaws.com/login").then(

      )

    }

    render() {

      return (
      <div>
        {!this.state.creatingAccount && <div className="container">
          <label htmlFor="email">Email</label>
          <input className="form-control" 
            type="text" 
            name="email" 
            id="email"
            value={this.state.email}
            onChange={e => this.setState({email: e.target.value})}
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
          <span>Don't have an account? </span>
          <Link className="btn btn-link new-account" to="/create">
            Create Account
          </Link>
          </div>}
        {this.state.creatingAccount && <CreateAccount/>}

      </div>
    );

    }

 }