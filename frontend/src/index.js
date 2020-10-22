import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as distributor from './distributor';
// This makes bootstrap work
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
    <React.StrictMode>
    <App />
    </React.StrictMode>,
     document.getElementById('root')
);

distributor.unregister();