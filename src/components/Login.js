import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { User, Lock, AlertCircle, BookOpen, Sparkles } from 'lucide-react';
import styled from 'styled-components';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  userType: Yup.string().required('User type is required')
});

const Login = () => {
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('student');
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
    <LoginContainer>
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-left">
            <div className="left-content">
              <LogoWrapper>
                <Sparkles className="logo-icon" />
              </LogoWrapper>
              <h1 className="brand-name">
                <span className="brand-one">One</span>
                <span className="brand-pass">Pass</span>
              </h1>
              <p className="brand-tagline">Unified Education Management</p>
              <div className="user-tabs">
                <div className={`tab ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>
                  For Students
                </div>
                <div className={`tab ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
                  For Administrators
                </div>
              </div>
              <div className="features">
                {activeTab === 'student' ? (
                  <>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <BookOpen size={18} />
                      </div>
                      <p>Access all your academic records in one place</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <p>Easy document management system</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1v22"></path>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <p>Apply for transfer certificates with ease</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                      </div>
                      <p>Comprehensive student management system</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <p>Efficiently approve transfer certificates</p>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                      </div>
                      <p>School database and academic record management</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="login-right">
            <div className="right-content">
              <h2>Welcome to OnePass</h2>
              <p className="subtitle">Sign in to {activeTab === 'student' ? 'your student account' : 'the administrator panel'}</p>
              
              {error && (
                <div className="error-container">
                  <AlertCircle size={16} />
                  <p>{error}</p>
                </div>
              )}
              
              <Formik
                initialValues={{ username: '', password: '', userType: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <div className="input-wrapper">
                        <User size={16} />
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={values.username}
                          onChange={handleChange}
                          placeholder="Enter your username"
                          className={touched.username && errors.username ? 'error' : ''}
                        />
                      </div>
                      {touched.username && errors.username && (
                        <p className="error-message">{errors.username}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <Lock size={16} />
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={values.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className={touched.password && errors.password ? 'error' : ''}
                        />
                      </div>
                      {touched.password && errors.password && (
                        <p className="error-message">{errors.password}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="userType">I am a</label>
                      <div className="input-wrapper select-wrapper">
                        <select
                          id="userType"
                          name="userType"
                          value={values.userType}
                          onChange={handleChange}
                          className={touched.userType && errors.userType ? 'error' : ''}
                        >
                          <option value="">Select user type</option>
                          <option value="student">Student</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      {touched.userType && errors.userType && (
                        <p className="error-message">{errors.userType}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`login-button ${isSubmitting ? 'disabled' : ''}`}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                )}
              </Formik>
              
              <div className="additional-links">
                <a href="#">Forgot password?</a>
                <span className="divider">•</span>
                <a href="#">Need help?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 2rem;
  
  .login-wrapper {
    width: 100%;
    max-width: 1000px;
  }
  
  .login-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    min-height: 600px;
  }
  
  .login-left {
    background: linear-gradient(135deg, #1a237e, #4a148c);
    color: white;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(rgba(255, 255, 255, 0.1), transparent 70%);
      opacity: 0.6;
    }
  }
  
  .left-content {
    position: relative;
    z-index: 1;
    width: 100%;
  }
  
  .login-right {
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .right-content {
    max-width: 360px;
    margin: 0 auto;
    width: 100%;
  }
  
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  
  .subtitle {
    color: #7f8c8d;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #2c3e50;
    }
  }
  
  .input-wrapper {
    position: relative;
    
    svg {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #95a5a6;
    }
    
    input, select {
      width: 100%;
      padding: 0.75rem 0.75rem 0.75rem 2.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;
      
      &:focus {
        border-color: #6e8efb;
        box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
        outline: none;
      }
      
      &.error {
        border-color: #e74c3c;
      }
      
      &::placeholder {
        color: #bdc3c7;
      }
    }
    
    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2395a5a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 40px;
    }
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(110, 142, 251, 0.4);
      transform: translateY(-2px);
    }
    
    &.disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
  
  .error-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #fdeeee;
    border-left: 3px solid #e74c3c;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    
    svg {
      color: #e74c3c;
      flex-shrink: 0;
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
      color: #e74c3c;
    }
  }
  
  .additional-links {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    
    a {
      color: #6e8efb;
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: #a777e3;
      }
    }
    
    .divider {
      margin: 0 0.5rem;
      color: #bdc3c7;
    }
  }
  
  .brand-name {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    
    .brand-one {
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .brand-pass {
      color: white;
    }
  }
  
  .brand-tagline {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 1.5rem;
  }
  
  .features {
    margin-top: 3rem;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 1.25rem;
    
    .feature-icon {
      background: rgba(255, 255, 255, 0.2);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    p {
      font-size: 0.875rem;
      opacity: 0.9;
      margin: 0;
    }
  }
  
  .logo-wrapper {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    
    .logo-icon {
      color: white;
      width: 32px;
      height: 32px;
    }
  }
  
  .user-tabs {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 2rem;
    overflow: hidden;
    
    .tab {
      flex: 1;
      padding: 0.75rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
      
      &.active {
        background: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }
      
      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.15);
      }
    }
  }
  
  @media (max-width: 768px) {
    .login-card {
      flex-direction: column;
    }
    
    .login-left {
      padding: 2rem;
    }
    
    .login-right {
      padding: 2rem;
    }
    
    .features {
      margin-top: 2rem;
    }
  }
`;

const LogoWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  .logo-icon {
    color: white;
    width: 32px;
    height: 32px;
  }
`;

export default Login;