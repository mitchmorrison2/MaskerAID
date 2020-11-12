import React from 'react';
import { User } from '../models/User';
import { Orders } from '../models/Orders';
import axios from 'axios';
import './OrderHistory.css';

export class OrderHistory extends React.Component{
//pulls up any orders that the user has made
    orders = [
        //dummy data until we pull actual data from api
        //transactionId, name, country, productId, quantity, userId, distributorId
        {id: 1,
        name: "Masks",
        country: "US",
        productId: "2",
        quantity: 500,
        userId: 1,
        distributorId: 1
        },
        {id: 2,
            name: "Gloves",
            country: "UK",
            productId: "3",
            quantity: 250,
            userId: 1,
            distributorId: 1
        }
    ]
//cards for each individual order  
    render() {
        return (
            <div>
                <h1>Order History</h1>
            <li><div className="container" 
            style={{
                width: "500%",
                border: "solid 3px #d3d3d3",
                margin: "10px auto"
                }}>
                    <p>Order ID: <strong>{this.orders[0].id}</strong></p>
                    <p>Product: <strong>{this.orders[0].name}</strong></p>
                    <p> Country: {this.orders[0].country}</p>
                    <p> Product ID: {this.orders[0].productId}</p>

        </div>
        </li>
       <p>Return</p>
        </div>
        
        )}

}