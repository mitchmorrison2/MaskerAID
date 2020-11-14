import axios from 'axios';

export class repository {
    url = "http://ec2-34-214-157-239.us-west-2.compute.amazonaws.com:3000";   //put ec2 instance here

    config = {
        headers: {
            Authorization: '*'
        }
    }


    //Account stuff    path = /account
    //POST /account on DB side
    addAccount(email, password){
        return new Promise((resolve, reject) => {
            axios.post(`${this.url}/account`, {email: email, password: password}, this.config).then(resp => {
                if(resp.data == "L")
                {
                    return alert("Email already in use");
                }
                else {
                    resolve(resp.data);
                }
            }).catch(err => alert(err));
        });
    }
    //logging in 
    login(email, password){
        return new Promise((resolve, reject) => {
            axios.post(`${this.url}/login`, {email: email, password: password})
        })
        .then(response => {
            console.log(response);
        })
        .catch(e => {
            console.log(e);
        });
    }

    getAccount(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${this.url}/login/${id}`)
        })
        .then(response => {
            console.log(response);
        })
        .catch(e => {
            console.log(e);
        });
    }

    //deleting account - app.delete
    deleteAccount(){
        return new Promise((resolve, rejecct) =>
        axios.delete(`${this.url}/account`))
    }

}//end repository