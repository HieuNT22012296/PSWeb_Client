import axios from "axios";

const API_URL = "http://localhost:5199/api/Payments";

export const processPayment = async (paymentInfo) => {
  try {
    const response = await axios.post(API_URL, paymentInfo);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

export const getPayments = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  };
  
  export const getPaymentById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment with id ${id}:`, error);
      throw error;
    }
  };