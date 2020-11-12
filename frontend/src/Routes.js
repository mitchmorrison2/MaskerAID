import { CreateAccount } from "./pages/CreateAccount";
const { UserProfile } = require("./pages/UserProfile");
const { OrderHistory } = require("./pages/OrderHistory");
const {Login} = require("./pages/Login");
export const Routes = [
    //update these to true for when actual accounts are being used
    { path: '/', component: Login, authRequired: false},
    { path: '/OrderHistory', component: OrderHistory, authRequired: false},
    { path: '/CreateAccount', component: CreateAccount, authRequired: false},
    { path: '/UserProfile', component: UserProfile, authRequired: true}
];
