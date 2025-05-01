import API from './api';

export const getStudentProfile = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const getAcademicRecords = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}/academic-records`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch academic records' };
  }
};

export const getDocuments = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}/documents`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

export const uploadDocument = async (studentId, formData) => {
  try {
    // Log the request details for debugging
    console.log(`Uploading document for student ${studentId}`);
    
    const response = await API.post(`/api/students/${studentId}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Add timeout and retry config
      timeout: 30000, // 30 seconds timeout
    });
    
    console.log('Upload API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Document upload error in service:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      throw error.response.data || { message: 'Failed to upload document (server error)' };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      throw { message: 'Failed to upload document (no response from server)' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw { message: 'Failed to upload document (request error)' };
    }
  }
};

export const getTransferCertificates = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}/transfer-certificate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch transfer certificates' };
  }
};

export const applyForTransferCertificate = async (studentId, data) => {
  try {
    const response = await API.post(`/api/students/${studentId}/transfer-certificate`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to apply for transfer certificate' };
  }
};

export const getSchemes = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}/schemes`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch schemes' };
  }
};
