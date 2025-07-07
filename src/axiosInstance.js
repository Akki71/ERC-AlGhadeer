import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://portal.rcuae.ae/api",
  headers: {
    "Content-type": "application/json"
  }
});

export default axiosInstance;
