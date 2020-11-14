import axios from 'axios';

export class repository {
    url = "http://ec2-34-214-157-239.us-west-2.compute.amazonaws.com:3000";   //put ec2 instance here

    config = {
        headers: {
            Authorization: '*'
        }
    }


    //Account stuff    path = /account
    addAccount(email, password){
        return new Promise((resolve, reject) => {
            axios.post(`${this.url}/user/account`, {email: email, password: password}, this.config).then(resp => {
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

}//end repository