import React from 'react';
import { User } from '../models/User';
import { NavigationBar } from '../models/NavigationBar';
import styled, {css} from 'styled-components';
import './UserProfile.css';





export class UserProfile extends React.Component{
    users = [
        new User(1, "kpulaski@trek.com", "Katherine Pulaski", "214-555-1212", "password", "United States")
    ]
//
    state = {
        role: "Hospital Worker",
        isHospital: true,
        phoneNumbers: [
            { number: '214-555-1212', type: 'fax' }
        ],
        images: [   //360x450
            "https://static.wikia.nocookie.net/memoryalpha/images/9/96/Katherine_Pulaski.jpg/revision/latest/top-crop/width/360/height/450?cb=20121204025419&path-prefix=en"
        ]
    }
    addPhone(phone){
        var phoneNumbers = this.state.phoneNumbers;
        phoneNumbers.push(phone);
        this.setState({ phoneNumbers });
    }
    //onClick={handleChange}
    handleChange(){
        var x = document.getElementById("form-group");
        if (x.style.visibility === "hidden") {
            x.style.visibility = "show";
        } else {
            x.style.visibility = "hidden";
        }
    }

    render() {
        return (<form className="container">
            <div>
            <span></span>
            <h1>{this.users[0].name}</h1>
            <img src={katherine} transform height ="350" width="350"/>
            </div>
            <div className="form-group">
                <p>Name: {this.users[0].name}</p>
                </div>
                <div>
                <p> Role: {this.state.role} </p>
                
                    
            </div>
            <div className="personal">
                <h2> Personal Information </h2>
                <p>Email: {this.users[0].email}</p>
                <p>Phone: {this.users[0].phone} </p>
                <p>Hospital Address: 'will add later'</p>
                <p>Country: {this.users[0].country}</p>
                <p>Password: ******** </p>
            </div>
            <button type="button" onClick={this.handleChange} id="submitNew" name="submitNew" className="btn btn-primary pull-right" >Update Profile</button>
            <div className="col-md-5">
          <div className="form-area">  
              <form role="form">
                <br styles="clear:both" />
                <div className="form-group">
                  <input value={this.state.name} type="text" onChange={this.handleNameChange} className="form-control" placeholder="Name" required/>
                </div>
                <div className="form-group">
                  <input value={this.state.password} type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" required />
                </div>
                
                
              </form>
          </div>
        </div>
            </form>)
        }
}

