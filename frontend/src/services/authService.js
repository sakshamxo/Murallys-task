//src/services/authService.js
import axiosInstance from './axiosInstance';

export const registerCustomer = async (userData) => {
  const res = await axiosInstance.post('/api/auth/register/customer', userData);
  return res.data;
};

export const registerAgent = async (userData) => {
  const res = await axiosInstance.post('/api/auth/register/agent', userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post('/api/auth/login', credentials);
  return res.data;
};

export const logoutUser = async () => {
  await axiosInstance.post('/api/auth/logout');
};

// ⭐ NEW: Fetch customer dashboard packages
export const fetchCustomerDashboard = async () => {
  try {
   
    const res = await axiosInstance.get('/api/auth/dashboard/customer');
    console.log(res.data);
    return res.data;
    
  } catch (error) {
    console.error("Failed to fetch agent packages", error)
  }
};

// ⭐ NEW: Fetch agent dashboard packages
export const fetchAgentDashboard = async () => {
  try {

    const res = await axiosInstance.get('/api/auth/dashboard/agent');
    console.log(res.data);
    return res.data;
    
  } catch (error) {
    console.error("Failed to fetch agent dashboard packages", error)
  }
};