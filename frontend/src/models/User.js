export class User{
    constructor(userID, email, name, phone, password, country) {
        
        this.userID = userID;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.country = country;
        this.date = new Date();
    }
}
