export class User{
    constructor(email, name, phone, password, country) {
        //date DATETIME
        this.name = name;
        this.email = email;
        this.country = country;
        this.phone = phone;
        this.password = password;
    }
}