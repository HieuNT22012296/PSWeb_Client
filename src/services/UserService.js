import axios from "axios";

const baseUrl = "http://localhost:3001/api";

export const signUpUser = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/user/sign-up`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/user/sign-in`, data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        error: "User not found.",
      };
    } else {
      console.error("An error occurred while accessing user data:", error);
      return {
        error:
          "An error occurred while accessing user data. Please try again later.",
      };
    }
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(`${baseUrl}/user/log-out`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDetailsUser = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/user/get-details/${id}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        error: "User not found.",
      };
    } else {
      console.error("An error occurred while accessing user data:", error);
      return {
        error:
          "An error occurred while accessing user data. Please try again later.",
      };
    }
  }
};

export const getAllUser = async () => {
  try {
    const res = await axios.get(`${baseUrl}/user/getAll/`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await axios.put(`${baseUrl}/user/update-user/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/user/delete-user/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteManyUser = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/user/delete-many/`, data);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
