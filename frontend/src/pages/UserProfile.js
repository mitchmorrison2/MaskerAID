import React from 'react';
import { Orders } from '../models/Orders';

export class userProfile extends React.Component{

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
            <h1>Account Editor</h1>
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
                <label htmlFor="isEmployee">
                    <input type="checkbox"
                        id="isEmployee"
                        name="isEmployee"
                        checked={this.state.isEmployee}
                        onChange={ event => this.setState({ isEmployee: event.target.checked }) } />
                        Is Employee
                    </label>
            </div>

            <div className="form-group">
                <label htmlFor="departmentId">Department</label>
                <select id="departmentId"
                    name="departmentId"
                    className="form-control"
                    value={this.state.departmentId}
                    onChange={ event => this.setState({ departmentId: event.target.value }) }>
                        <option></option>
                        {
                            this.departments.map(x => <option key={ x.id } value={ x.id }>{ x.name }</option>)
                        }
                </select>
            </div>

            <PhoneList phoneNumbers={ this.state.phoneNumbers } />
            <PhoneEditor onPhoneAdded={ phone => this.addPhone(phone) } />
            
        </form>;
    }//end render
}//end userProfile class