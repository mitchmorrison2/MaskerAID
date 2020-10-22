import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      number: "",
      values: []
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handle input field state change
  handleChange = (e) => {
    this.setState({number: e.target.value})
  }

  // handle input form submission to backend via POST request
  handleSubmit = (e) => {
    e.preventDefault();
    let prod = this.state.number * this.state.number;
    axios.post('http://localhost:8000/multplynumber', {product: prod}).then(res =>{
      console.log(res);
      this.fetchVals();
    });
    this.setState({number: ""});
  }

  // handle intialization and setup of database table, can reinitialize to wipe db
  reset = () => {
    axios.post('http://localhost:8000/reset').then(res => {
      console.log(res);
      this.fetchVals();
    });
  }

  // tell app to fetch values from db on first load (if initialized)
  componentDidMount(){
    this.fetchVals();
  }

  // fetches vals of db via GET request
  fetchVals = () => {
    axios.get('http://localhost:8000/values').then(
      res => {
        const values = res.data;
        console.log(values.data);
        this.setState({ values: values.data });
    });
  }


  render(){/*
    return (
      <div className="App">
        <header className="App-header">
        <button onClick={this.reset}> Reset DB </button>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.number} onChange={this.handleChange}/>
            <br/>
            <input type="submit" value="Submit" />
          </form>
          <ul>
            { this.state.values.map((value, i) => <li key={i}>{value.value}</li>) }
          </ul>
          <button className="test">Press this button</button>
          
        </header>
      </div>*/
      return (<div className="form-group col-md-6">

          <h1 className="">MaskerAid</h1>
          <label htmlFor="username">Username</label>
          <input className="form-control" type="text" name="username" id="username"/>
          <br/>
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" name="password" id="password"/>
          <br/>
          <label htmlFor="acct-type">Account type</label>
          <select className="form-control" id="account-type">
            <option></option>
            <option>Distributor</option>
            <option>Government</option>
            <option>etc etc...</option>
          </select>
          <button className="btn btn-primary btn-block">Login</button>
          <p>Don't have an account?</p>
        </div>
    );
  }

}

export default App;
