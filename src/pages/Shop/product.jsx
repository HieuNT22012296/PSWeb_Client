import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";

export const Product = (props) => {
  const { id, name, price, image } = props.data;
  const { addToCart, cartItems } = useContext(ShopContext);

  const cartItemCount = cartItems[id] || 0;

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự lan truyền của sự kiện click
    addToCart(id);
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
