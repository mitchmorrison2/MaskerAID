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
            <li><div class="card" 
            style={{
                width: "500%",
                border: "solid 3px #d3d3d3",
                margin: "10px auto"
                }}>
                    
                <div data-role="page" class="pages" >
                {this.orders.map((order, index) => (
          <div key={index}>
            <h1>Product: {order.name} {order.productId}</h1>
            <p>Country: {order.country}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Distributor ID: {order.distributorId}</p>
          </div>
        ))}
                  
                    </div>
                    

        </div>
        </li>
       <p>Return</p>
        </div>
        
        )}

}