import React from 'react';
import { Orders } from '../models/Orders';

export class UserProfile extends React.Component{

    state = {
        name: '',
        email: '',
        country: '',
        address: '',
        isDistributor: false,
        phoneNumbers: [
            { number: '214-555-1212', type: 'fax' }
        ]
    };

    render() {
        return <form className="container">
            <h1>User Profile</h1>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={this.state.name}
                    onChange={ event => this.setState({ name: event.target.value }) } />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    value={this.state.email}
                    onChange={ event => this.setState({ email: event.target.value }) } />
            </div>

            <div className="form-group">
                <label htmlFor="Country">Country</label>
                
            </div>

            
            
        </form>;
    }//end render
}//end userProfile class

/*
<PhoneList phoneNumbers={ this.state.phoneNumbers } />
            <PhoneEditor onPhoneAdded={ phone => this.addPhone(phone) } />
*/