import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import "./navbar.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="shop-link">Home</Link>
      <div className="links">
        <Link to="/contact">Contact</Link>
        <Link to="/cart">
          <ShoppingCart size={32} />
        </Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};
