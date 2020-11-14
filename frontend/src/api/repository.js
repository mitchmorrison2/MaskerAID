import axios from 'axios';

export class repository {
    url = "";   //put ec2 instance here

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
    }

}//end repository