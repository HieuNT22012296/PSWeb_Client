import Register from "../pages/Register/Register";
// import navbar from "../components/navbar/navbar";
import Login from "../pages/Login/Login";
import { Shop } from "../pages/Shop/shop";
import { Cart } from "../pages/cart/cart";
import { Payment } from "../pages/payment/Payment";
import Profile from "../pages/Profile/Profile";
import Order from "../pages/Order/Order";
import OrderDetail from "../pages/OrderDetails/OrderDetail";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Admin from "../pages/Admin/Admin";

export const routes = [
  {
    path: "/login",
    page: Login,
  },
  {
    path: "/sign-up",
    page: Register,
  },
  {
    path: "/",
    page: Shop,
  },
  {
    path: "/cart",
    page: Cart,
  },
  {
    path: "/payment",
    page: Payment,
  },
  {
    path: "/profile",
    page: Profile,
  },
  {
    path: "/order",
    page: Order,
  },
  {
    path: "/order-details",
    page: OrderDetail,
  },
  {
    path: "/product-details",
    page: ProductDetails,
  },
  {
    path: "/dashboard",
    page: Admin,
  },
];
