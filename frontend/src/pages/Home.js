import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import {Itemdetails} from "./itemdetails.js";




export default function showHome(){

    return(
        <div className = "Container" >
            <h1>MaskerAid</h1>
            <button className= "topButtons">Account</button>
            <button className= "topButtons" >Logout</button>
            <div className = "myclass">
                < Itemdetails/>
            </div>

        </div>









    )
}