import React from 'react'
import './Header.css'

export class Header extends React.Component {

    render() {

        return(

            <header>
                <h1 className="page-header">MaskerAid
                    {this.props.loggedIn && <button type="button" className="btn btn-primary float-right">Logout</button>}
                </h1>
            </header>

        );


    }
        

}