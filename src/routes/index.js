// import Register from "../pages/Register/Register";
// import navbar from "../components/navbar/navbar";
import Login from "../pages/Login/Login";
import { Shop } from "../pages/Shop/shop";
import { Cart } from "../pages/cart/cart";
import { Payment } from "../pages/payment/Payment";


export const routes = [
  {
    path: "/login",
    page: Login,
  },
  // {
  //   path: "/register",
  //   page: Register,
  // },
  {
    path: "/",
    page: Shop
  },
  {
    path: "/cart",
    page: Cart,
  },
  {
    path: "/payment",
    page: Payment
  },
];
