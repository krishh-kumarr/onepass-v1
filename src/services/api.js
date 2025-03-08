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
    const response = await API.get('/tables/TRANSFER_CERTIFICATE'); // Fetch data from backend
    console.log("API Response:", response.data);  // Debugging: Check API response
    return response.data.TRANSFER_CERTIFICATE || []; // Ensure correct data structure
  } catch (error) {
    console.error("Failed to fetch transfer certificates:", error);
    return []; // Prevent crashes by returning an empty array
  }
};

export default API;
