import React from 'react'

export class CreateAccount extends React.Component {

    state = {

        username: "",
        password: "",
        confirmPassword: "",
        accountType: ""

    }

    //Functionality needed for creation errors:
    //Username taken
    //Passwords don't match

    render() {

        return (

            <div className="container">

                <h3>Create Account</h3>

                <label htmlFor="username">Username</label>
                <input className="form-control"
                type="text" 
                name="username" 
                id="acct-username"
                value={this.state.username}
                onChange={e => this.setState({username: e.target.value})}
                />

                <label htmlFor="password">Password</label>
                <input className="form-control" 
                type="password" 
                name="password" 
                id="acct-password"
                value={this.state.password}
                onChange={e => this.setState({password: e.target.value})}/>

                <label htmlFor="password-confirm">Confirm Password</label>
                <input className="form-control"
                type="password" 
                name="password-confirm" 
                id="password-confirm"
                value={this.state.confirmPassword}
                onChange={e => this.setState({confirmPassword: e.target.value})}/>

                <label htmlFor="account-type">Account Type</label>
                <select className="form-control col-6" id="account-type"
                    value={this.state.accountType}
                    onChange={e => this.setState({accountType: e.target.value})}>

                    <option></option>
                    <option>Distributor</option>
                    <option>Government</option>
                    <option>User</option>
                    <option>etc etc...</option>
                    
                </select>
                <div className="alert alert-danger" role="alert">Sample error -- for username already taken or mismatching passwords</div>
                <button className="btn btn-primary btn-block">Create Account</button>
            </div>

        );

    }

}