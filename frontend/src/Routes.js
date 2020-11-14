import {CreateAccount} from "./pages/CreateAccount";
import showHome from "./pages/Home";
import { Itemdetails } from "./pages/itemdetails";
import {Login} from "./pages/Login";
import { OrderHistory } from "./pages/OrderHistory";
import { UserProfile } from "./pages/UserProfile";

export const ROUTES = [
    { path: '/create', component: CreateAccount },
    { path: '/orders', component: OrderHistory},
    { path: '/userP', component: UserProfile},
    { path: '/home', component: Itemdetails},
    { path: '/', component: Login}
]