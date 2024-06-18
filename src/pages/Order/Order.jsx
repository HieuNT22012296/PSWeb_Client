import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { postOrder } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";


const Order = () => {
  const { cartItems, products, getTotalCartAmount } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Tạo danh sách các sản phẩm trong đơn hàng
    const orderItems = products.filter(product => cartItems[product.id] > 0)
      .map(product => ({
        product_id: product.id,  // Convert product_id to string
        name: product.name,
        quantity: cartItems[product.id],
        price: product.price.toString(), // Convert price to string
      }));
  
    // Kiểm tra xem giỏ hàng có sản phẩm hay không
    if (orderItems.length === 0) {
      setError("Your cart is empty. Please add products to your cart before placing an order.");
      return;
    }
  
    // Tạo dữ liệu đơn hàng
    const orderData = {
      payment_method: formData.paymentMethod,
      total_price: totalAmount.toString(), // Convert total price to string
      shipping_price: "5.00", // Add actual shipping price if any
      user_id: 1, // Replace with actual user ID
      is_paid: false,
      paid_at: null,
      is_delivered: false,
      delivered_at: null,
      order_items: orderItems,
      shipping_address: {
        full_name: formData.fullName,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
      },
    };
  
    console.log("Order data:", orderData);  // Log order data for debugging
  
    try {
      const response = await postOrder(orderData);
      console.log("Order posted successfully:", response);
      navigate("/payment"); // Chuyển hướng sang trang thanh toán
    } catch (error) {
      console.error("Failed to post order:", error);
      if (error.response && error.response.data) {
        console.error("Error details:", error.response.data);
      }
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        rel="canonical"
        href="https://getbootstrap.com/docs/4.3/examples/checkout/"
      />
      <link
        href="/docs/4.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n      .bd-placeholder-img {\n        font-size: 1.125rem;\n        text-anchor: middle;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n      }\n\n      @media (min-width: 768px) {\n        .bd-placeholder-img-lg {\n          font-size: 3.5rem;\n        }\n      }\n    ",
        }}
      />
      <link href="form-validation.css" rel="stylesheet" />
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-md-4 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Your cart</span>
              <span className="badge badge-secondary badge-pill">
                {Object.keys(cartItems).reduce((total, item) => total + cartItems[item], 0)}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {products.map((product) => {
                if (cartItems[product.id] > 0) {
                  return (
                    <li key={product.id} className="list-group-item d-flex justify-content-between lh-condensed">
                      <div>
                        <h6 className="my-0">{product.name} x {cartItems[product.id]}</h6>
                      </div>
                      <span className="text-muted">${product.price}</span>
                    </li>
                  );
                }
                return null;
              })}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${totalAmount}</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-8 order-md-1">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder=""
                    required=""
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    Valid full name is required.
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="123-456-7890"
                    required=""
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    Please enter a valid phone number.
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="1234 Main St"
                  required=""
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <div className="invalid-feedback">
                  Please enter your shipping address.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="city">City</label>
                <select
                  className="custom-select d-block w-100"
                  id="city"
                  required=""
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Choose...</option>
                  <option value="Ho Chi Minh">Ho Chi Minh</option>
                  <option value="Hanoi">Hanoi</option>
                  <option value="Da Nang">Da Nang</option>
                  <option value="Can Tho">Can Tho</option>
                  <option value="Hai Phong">Hai Phong</option>
                  <option value="Nha Trang">Nha Trang</option>
                  <option value="Vung Tau">Vung Tau</option>
                </select>
                <div className="invalid-feedback">
                  Please select a valid city.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className="d-block my-3">
                  <div className="custom-control custom-radio">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      className="custom-control-input"
                      required=""
                      value="Credit card"
                      checked={formData.paymentMethod === "Credit card"}
                      onChange={handleRadioChange}
                    />
                    <label className="custom-control-label" htmlFor="credit">
                      Credit card
                    </label>
                  </div>
                  <div className="custom-control custom-radio">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      className="custom-control-input"
                      required=""
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleRadioChange}
                    />
                    <label className="custom-control-label" htmlFor="cod">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
                <div className="invalid-feedback">
                  Please select a valid payment method.
                </div>
              </div>
              <hr className="mb-4" />
              <button className="btn btn-primary btn-lg btn-block" type="submit">
                Continue to payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
