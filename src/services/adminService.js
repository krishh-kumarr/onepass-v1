import API from './api';

const handleRequest = async (request, errorMessage) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: errorMessage };
  }
};

export const getAllStudents = async () => {
  return handleRequest(API.get('/api/admin/students'), 'Failed to fetch students');
};

export const getAllTransferCertificates = async () => {
  try {
    const response = await API.get('/tables/TRANSFER_CERTIFICATE');
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transfer certificates:", error);
    throw error.response?.data || { message: "Failed to fetch transfer certificates" };
  }
};


export const updateTransferCertificate = async (tcId, data) => {
  return handleRequest(API.patch(`/api/admin/transfer_certificate/${tcId}`, data), 'Failed to update transfer certificate');
};

export const getAllSchools = async () => {
  return handleRequest(API.get('/api/admin/schools'), 'Failed to fetch schools');
};
