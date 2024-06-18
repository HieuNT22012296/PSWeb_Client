import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { processPayment } from "../../services/PaymentService"; // Import hàm processPayment

export const Payment = () => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const { getTotalCartAmount } = useContext(ShopContext);
  const total = getTotalCartAmount();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentInfo = {
      orderId: orderData.id,
      Total: total,
      paymentMethod: selectedPaymentMethod,
      paymentDate: new Date(),
    };

    try {
      const response = await processPayment(paymentInfo);
      console.log("Payment processed:", response);
      if (response.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <section className="payment-section">
      <div className="container py-5">
        <div className="card">
          <div className="card-body">
            <div className="row d-flex justify-content-center pb-5">
              <div className="col-md-7 col-xl-5 mb-4 mb-md-0">
                <div className="py-4 d-flex flex-row">
                  <h5>
                    <span className="far fa-check-square pe-2" />
                    <b>ELIGIBLE</b> |
                  </h5>
                  <span className="ps-2">Pay</span>
                </div>
                <h4>Payment Details</h4>
                <p>
                  Ensure you have reviewed all the details before proceeding with the payment.
                </p>
                <hr />
                <div className="pt-2">
                  <form className="pb-3" onSubmit={handleSubmit}>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          value="cod"
                          checked={selectedPaymentMethod === "cod"}
                          onChange={handlePaymentMethodChange}
                        />
                      </div>
                      <div className="rounded border d-flex w-100 p-3 align-items-center">
                        <p className="mb-0">Cash on Delivery (COD)</p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="visaCard"
                          value="visa"
                          checked={selectedPaymentMethod === "visa"}
                          onChange={handlePaymentMethodChange}
                        />
                      </div>
                      <div className="rounded border d-flex w-100 p-3 align-items-center">
                        <p className="mb-0">
                          <i className="fab fa-cc-visa fa-lg text-primary pe-2" />
                          Visa Debit Card
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="masterCard"
                          value="mastercard"
                          checked={selectedPaymentMethod === "mastercard"}
                          onChange={handlePaymentMethodChange}
                        />
                      </div>
                      <div className="rounded border d-flex w-100 p-3 align-items-center">
                        <p className="mb-0">
                          <i className="fab fa-cc-mastercard fa-lg text-body pe-2" />
                          Mastercard Office
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="banking"
                          value="banking"
                          checked={selectedPaymentMethod === "banking"}
                          onChange={handlePaymentMethodChange}
                        />
                      </div>
                      <div className="rounded border d-flex w-100 p-3 align-items-center">
                        <p className="mb-0">Internet Banking</p>
                      </div>
                    </div>
                    <div className="d-flex flex-row pb-3">
                      <div className="d-flex align-items-center pe-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="qr"
                          value="qr"
                          checked={selectedPaymentMethod === "qr"}
                          onChange={handlePaymentMethodChange}
                        />
                      </div>
                      <div className="rounded border d-flex w-100 p-3 align-items-center">
                        <p className="mb-0">QR Code Payment</p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-lg"
                    >
                      Proceed to payment
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-md-5 col-xl-4 offset-xl-1">
                <div className="py-4 d-flex justify-content-end">
                  <h6>
                    <Link to="/">
                      Cancel and return to website
                    </Link>
                  </h6>
                </div>
                <div className="rounded d-flex flex-column p-3 bg-body-tertiary">
                  <h4 className="pb-3">Order Recap</h4>
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Order ID</div>
                    <div>{orderData?.id}</div>
                  </div>
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Total</div>
                    <div>${orderData?.total_price}</div>
                  </div>
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Currency</div>
                    <div>USD</div>
                  </div>
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Payment Date</div>
                    <div>{formatDate(orderData?.created_at)}</div>
                  </div>
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Status</div>
                    <div>Pending</div>
                  </div>
                  <div className="border-top my-3" />
                  <div className="p-2 d-flex justify-content-between">
                    <div className="fw-bold">Total</div>
                    <div className="text-success">{orderData?.total_price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};