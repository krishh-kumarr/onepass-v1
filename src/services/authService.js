import API from './api';

export const login = async (credentials) => {
  try {
    const response = await API.post('/api/auth/login', credentials);  // Updated endpoint

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
