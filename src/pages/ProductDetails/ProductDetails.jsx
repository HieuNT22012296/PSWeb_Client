import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './ProductDetails.css';
import { ShopContext } from "../../context/shop-context";
import { getProductByID } from "../../services/ProductService";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Số lượng ban đầu là 1
  const { addToCart } = useContext(ShopContext); // Lấy hàm addToCart từ ShopContext
  const [showNotification, setShowNotification] = useState(false); // Trạng thái để hiển thị thông báo

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductByID(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    loadProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const { name, price, image, type, rating, description } = product;

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(id);
    }
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000); // Hiển thị thông báo trong 2 giây
  };

  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="row gx-5">
            <aside className="col-lg-6">
              <div className="border rounded-4 mb-3 d-flex justify-content-center">
                <a
                  data-fslightbox="mygalley"
                  className="rounded-4"
                  target="_blank"
                  data-type="image"
                  href={image}
                >
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100vh",
                      margin: "auto",
                    }}
                    className="rounded-4 fit"
                    src={image}
                    alt={name}
                  />
                </a>
              </div>
              <div className="d-flex justify-content-center mb-3">
                <a
                  data-fslightbox="mygalley"
                  className="border mx-1 rounded-2"
                  target="_blank"
                  data-type="image"
                  href={product.image}
                >
                  <img
                    width={60}
                    height={60}
                    className="rounded-2"
                    src={product.image}
                  />
                </a>
              </div>
              <div className="d-flex justify-content-center mb-3">
                {/* Nếu có thêm hình ảnh nhỏ */}
              </div>
            </aside>
            <main className="col-lg-6">
              <div className="ps-lg-3">
                <h4 className="title text-dark">{name}</h4>
                <div className="d-flex flex-row my-3">
                  <div className="text-warning mb-1 me-2">
                    {[...Array(rating)].map((_, i) => (
                      <i key={i} className="fa fa-star" />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <i key={i} className="fa fa-star-o" />
                    ))}
                    <span className="ms-1">{rating}</span>
                  </div>
                  <span className="text-muted">
                    <i className="fas fa-shopping-basket fa-sm mx-1" />
                    154 orders
                  </span>
                  <span className="text-success ms-2">In stock</span>
                </div>
                <div className="mb-3">
                  <span className="h5">${price}</span>
                </div>
                <p>{description}</p>
                <div className="row">
                  <dt className="col-3">Type:</dt>
                  <dd className="col-9">{type}</dd>
                  <dt className="col-3">Color</dt>
                  <dd className="col-9">Brown</dd>
                </div>
                <hr />
                <div className="row mb-4">
                  <div className="col-md-4 col-6 mb-3">
                    <label className="mb-2 d-block">Quantity</label>
                    <div className="input-group mb-3" style={{ width: 170 }}>
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <i className="fas fa-minus" />
                      </button>
                      <input
                        type="number"
                        className="form-control text-center border border-secondary"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <button
                        className="btn btn-white border border-secondary px-3"
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary shadow-0 py-2" onClick={handleAddToCart}>
                  <i className="me-1 fa fa-shopping-basket" /> Add to cart
                </button>
                <a
                  href="#"
                  className="btn btn-light border border-secondary py-2 icon-hover px-3 ml-3"
                >
                  <i className="me-1 fa fa-heart fa-lg" /> Save
                </a>
                {showNotification && (
                  <div className="alert alert-success mt-3">
                    Sản phẩm đã được thêm vào giỏ hàng!
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};
export default ProductDetails;