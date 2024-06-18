import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";
import { Product } from "./product";
import { useNavigate } from "react-router-dom";
import "./shop.css";

export const Shop = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1>HyperRaze Shop</h1>
      </div>

      <div className="products">
        {products.map((product) => (
          <div key={product.id} onClick={() => handleProductClick(product.id)}>
            <Product data={product} />
          </div>
        ))}
      </div>
    </div>
  );
};