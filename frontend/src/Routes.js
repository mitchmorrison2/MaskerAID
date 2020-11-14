import {CreateAccount} from "./pages/CreateAccount";
import {Login} from "./pages/Login";
import { OrderHistory } from "./pages/OrderHistory";
import { UserProfile } from "./pages/UserProfile";

export const ROUTES = [
    { path: '/create', component: CreateAccount },
    { path: '/orders', component: OrderHistory},
    { path: '/userP', component: UserProfile},
    { path: '/', component: Login}
]