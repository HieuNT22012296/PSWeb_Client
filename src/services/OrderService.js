import axios from "axios";

const baseUrl = "http://localhost:8000/order"

export const getAllOrder = async () => {
    try {
      const res = await axios.get(`${baseUrl}/`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};

export const getOrderDetails = async (id) => {
    try {
      const res = await axios.post(`${baseUrl}/order/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
};

export const postOrder = async (orderData) => {
    try {
      const response = await axios.post(`${baseUrl}/`, orderData);
      return response.data;
    } catch (error) {
      console.error("Error posting order:", error);
      throw error;
    }
  };


  export const getAllOrderByUserID = async (userID) => {
    try {
      const response = await axios.get(`${baseUrl}/user_id/${userID}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };