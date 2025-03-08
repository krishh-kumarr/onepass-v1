import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { User, Lock, AlertCircle, School } from 'lucide-react';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  userType: Yup.string().required('User type is required')
});

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await login(values);
      setCurrentUser(data.user);
      
      if (data.user.userType === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-center items-center">
            <School className="text-white mr-2" size={28} />
            <h1 className="text-xl font-bold text-white">School Management System</h1>
          </div>
          
          <div className="p-6">
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            <Formik
              initialValues={{ username: '', password: '', userType: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={values.username}
                        onChange={handleChange}
                        className={`pl-10 block w-full rounded-md shadow-sm py-2 px-3 ${
                          touched.username && errors.username 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {touched.username && errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        className={`pl-10 block w-full rounded-md shadow-sm py-2 px-3 ${
                          touched.password && errors.password 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {touched.password && errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                      I am a
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      value={values.userType}
                      onChange={handleChange}
                      className={`block w-full rounded-md shadow-sm py-2 px-3 appearance-none ${
                        touched.userType && errors.userType 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select user type</option>
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                    </select>
                    {touched.userType && errors.userType && (
                      <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
        
        {/* Optional: Footer text */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Need help? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default Login;