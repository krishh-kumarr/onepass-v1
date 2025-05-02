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
    const response = await API.get('/api/admin/transfer-certificates');
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transfer certificates:", error);
    throw error.response?.data || { message: "Failed to fetch transfer certificates" };
  }
};

export const updateTransferCertificate = async (tcId, data) => {
  return handleRequest(
    API.patch(`/api/admin/transfer-certificates/${tcId}`, data),
    'Failed to update transfer certificate'
  );
};

export const deleteTransferCertificate = async (tcId) => {
  return handleRequest(
    API.delete(`/api/admin/transfer-certificates/${tcId}`),
    'Failed to delete transfer certificate'
  );
};

export const getAllSchools = async () => {
  return handleRequest(API.get('/api/admin/schools'), 'Failed to fetch schools');
};

export const getStudentDetails = async (studentId) => {
  return handleRequest(API.get(`/api/admin/students/${studentId}`), 'Failed to fetch student details');
};

export const updateStudent = async (studentId, data) => {
  return handleRequest(API.put(`/api/admin/students/${studentId}`, data), 'Failed to update student');
};

export const getComprehensiveStudentDetails = async (studentId) => {
  try {
    console.log(`Fetching comprehensive details for student ID: ${studentId}`);
    const response = await API.get(`/api/admin/students/${studentId}/comprehensive`);
    console.log('Comprehensive student details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comprehensive student details:', error);
    throw error.response?.data || { message: 'Failed to fetch comprehensive student details' };
  }
};

// New functions for academic records management
export const getAcademicRecords = async (studentId) => {
  return handleRequest(
    API.get(`/api/admin/academic-records`, { params: { studentId } }),
    'Failed to fetch academic records'
  );
};

export const addAcademicRecord = async (recordData) => {
  return handleRequest(
    API.post('/api/admin/academic-records', recordData),
    'Failed to add academic record'
  );
};

export const updateAcademicRecord = async (recordId, recordData) => {
  return handleRequest(
    API.put(`/api/admin/academic-records/${recordId}`, recordData),
    'Failed to update academic record'
  );
};

export const deleteAcademicRecord = async (recordId) => {
  return handleRequest(
    API.delete(`/api/admin/academic-records/${recordId}`),
    'Failed to delete academic record'
  );
};

export const bulkImportAcademicRecords = async (records) => {
  return handleRequest(
    API.post('/api/admin/academic-records/bulk-import', { records }),
    'Failed to import academic records'
  );
};

export const exportAcademicRecordsPDF = async (studentId, options = {}) => {
  try {
    const response = await API.get(`/api/admin/academic-records/export-pdf/${studentId}`, {
      responseType: 'blob',
      params: options
    });
    
    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `academic_records_${studentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { success: true };
  } catch (error) {
    console.error('Failed to export academic records to PDF:', error);
    throw error.response?.data || { message: 'Failed to export academic records to PDF' };
  }
};
