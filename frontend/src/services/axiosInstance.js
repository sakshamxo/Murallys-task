// src/services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Change if using env vars
  withCredentials: true,            // ✅ Required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;