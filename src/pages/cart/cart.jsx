import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import { Navbar } from "../../components/navbar";
import { convertPrice } from "../../utils";

export const Cart = () => {
  
  const { cartItems, getTotalCartAmount, products, clearCart } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar/>
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cart">
        {products.map((product) => {
          if (cartItems[product.id] !== 0) {
            return <CartItem data={product} key={product.id} />;
          }
          return null;
        })}
      </div>

      {totalAmount > 0 ? (
        <div className="checkout">
          <p> Tổng tiền: {convertPrice(totalAmount)} </p>
          <button onClick={() => navigate("/")}> Quay về </button>
          <button onClick={() => navigate("/order")}> Mua hàng </button>
          <button onClick={clearCart}>Xóa giỏ hàng</button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
    </div>
  );
};