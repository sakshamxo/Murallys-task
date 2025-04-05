//src/services/packageService.js
import axiosInstance from './axiosInstance';

// Get all customer packages (filtered by user's city)
export const getCustomerPackages = async () => {
  const res = await axiosInstance.get('/api/packages/all-packages', {
    withCredentials: true,
  });
  return res.data;
};


// Add a new package (requires city)
export const addPackage = async (packageData) => {
  const res = await axiosInstance.post(
    '/api/packages/create',
    packageData,
    { withCredentials: true }
  );
  return res.data;
};

// Delete package (for agent)
export const deletePackage = async (id) => {
  const res = await axiosInstance.delete(
    `/api/packages/delete/${id}`,
    { withCredentials: true }
  );
  return res.data;
};