import {CreateAccount} from "./pages/CreateAccount";
import {Login} from "./pages/Login";
import { OrderHistory } from "./pages/OrderHistory";

export const ROUTES = [
    { path: '/create', component: CreateAccount },
    { path: '/orders', component: OrderHistory },
    { path: '/', component: Login },
]