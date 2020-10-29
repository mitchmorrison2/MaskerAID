export class Orders{
    constructor(transactionId, name, country, productId, quantity, userId, distributorId) {
        //this.date = date;
        //new date
        this.date = new Date();
        this.transactionId = transactionId;
        this.name = name;
        this.country = country;
        this.productId = productId;
        this.quantity = quantity;
        this.userId = userId;
        this.distributorId = distributorId;
    }
}