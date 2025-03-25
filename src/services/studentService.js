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
    const response = await fetch(`http://localhost:5000/api/students/${studentId}/documents/upload`, {
      method: 'POST',
      body: formData,
      // credentials: 'include' // Add if using cookies/auth
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
export const getTransferCertificates = async (studentId) => {
  try {
    const response = await API.get(`/api/students/${studentId}/transfer_certificate`);
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