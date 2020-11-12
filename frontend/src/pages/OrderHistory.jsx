import React from 'react';
import { User } from '../models/User';
import { Orders } from '../models/Orders';
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
            <li><div className="container" 
            style={{
                width: "50%",
                border: "solid 3px #d3d3d3",
                margin: "10px auto"
                }}>
                    <p>Order ID: <strong>{this.order.id}</strong></p>
                    <p>Product: <strong>{this.orders.name}</strong></p>
                    <p> Country: {this.orders.country}</p>
                    <p> Product ID: {this.orders.productId}</p>

        </div>
        </li>
        )}

}