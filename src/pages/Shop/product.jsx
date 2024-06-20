import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Product = (props) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id, name, price, image } = props.data;
  const { addToCart, cartItems } = useContext(ShopContext);

  const cartItemCount = cartItems[id] || 0;

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleAddToCartClick = (e) => {
    if (user?.id) {
      e.stopPropagation(); // Prevent event propagation
      addToCart(id);
    } else {
      handleNavigateLogin();
    }
  };

  return (
    <div className="product">
      <img src={image} alt={name} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>${price}</p>
      </div>
      <button className="addToCartBttn" onClick={handleAddToCartClick}>
        Add To Cart {cartItemCount > 0 && <> ({cartItemCount})</>}
      </button>
    </div>
  );
};
