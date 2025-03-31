import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Ensure Flask is running on this URL
});

// Add authorization header if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to fetch all transfer certificates
export const getAllTransferCertificates = async () => {
  try {
    const response = await API.get('/api/admin/transfer-certificates'); // Fetch data from backend
    console.log("API Response:", response.data);  // Debugging: Check API response
    return response.data.transferCertificates || []; // Ensure correct data structure
  } catch (error) {
    console.error("Failed to fetch transfer certificates:", error);
    return []; // Prevent crashes by returning an empty array
  }
};

// Function to fetch a specific transfer certificate by ID
export const getTransferCertificateById = async (tcId) => {
  try {
    const response = await API.get(`/api/admin/transfer-certificates/${tcId}`);
    console.log("API Response:", response.data);  // Debugging: Check API response
    return response.data.transferCertificate || {}; // Ensure correct data structure
  } catch (error) {
    console.error(`Failed to fetch transfer certificate with ID ${tcId}:`, error);
    return {}; // Prevent crashes by returning an empty object
  }
};

// Function to approve or reject a transfer certificate
export const updateTransferCertificate = async (tcId, status, comments, processed_by) => {
  try {
    const response = await API.patch(`/api/admin/transfer-certificates/${tcId}`, {
      status,
      comments,
      processed_by,
    });
    console.log("API Response:", response.data);  // Debugging: Check API response
    return response.data.transferCertificate || {}; // Ensure correct data structure
  } catch (error) {
    console.error(`Failed to update transfer certificate with ID ${tcId}:`, error);
    return {}; // Prevent crashes by returning an empty object
  }
};

export default API;
