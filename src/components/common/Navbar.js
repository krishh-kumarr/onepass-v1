import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const AppNavbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <StyledNavbar>
      <Container fluid>
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              School Management System
            </Link>
          </div>

          {currentUser && (
            <div className="navbar-content">
              <div className="menu">
                {currentUser.userType === 'student' ? (
                  <>
                    <Link to="/student/dashboard" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <path
                            d="M213.3815,109.61945,133.376,36.88436a8,8,0,0,0-10.76339.00036l-79.9945,72.73477A8,8,0,0,0,40,115.53855V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V115.53887A8,8,0,0,0,213.3815,109.61945Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Dashboard</span>
                    </Link>
                    <Link to="/student/profile" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <circle
                            cx={128}
                            cy={96}
                            r={64}
                            fill="none"
                            stroke="currentColor"
                            strokeMiterlimit={10}
                            strokeWidth={16}
                          />
                          <path
                            d="M30.989,215.99064a112.03731,112.03731,0,0,1,194.02311.002"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Profile</span>
                    </Link>
                    <Link to="/student/academic-records" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <polyline
                            points="76.201 132.201 152.201 40.201 216 40 215.799 103.799 123.799 179.799"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                          <line
                            x1={100}
                            y1={156}
                            x2={160}
                            y2={96}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Academic</span>
                    </Link>
                    <Link to="/student/documents" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <path
                            d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                          <polyline
                            points="152 32 152 88 208 88"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Documents</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/admin/dashboard" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <path
                            d="M213.3815,109.61945,133.376,36.88436a8,8,0,0,0-10.76339.00036l-79.9945,72.73477A8,8,0,0,0,40,115.53855V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V115.53887A8,8,0,0,0,213.3815,109.61945Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Dashboard</span>
                    </Link>
                    <Link to="/admin/students" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <circle
                            cx={128}
                            cy={120}
                            r={40}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                          <path
                            d="M63.8,199.37a72,72,0,0,1,128.4,0"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                          <circle
                            cx={128}
                            cy={128}
                            r={96}
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Students</span>
                    </Link>
                    <Link to="/admin/schools" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <path
                            d="M224,196.8V59.2a8,8,0,0,0-4.9-7.4L128,16,36.9,51.8A8,8,0,0,0,32,59.2V196.8a8,8,0,0,0,4.9,7.4L128,240l91.1-35.8A8,8,0,0,0,224,196.8Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Schools</span>
                    </Link>
                    <Link to="/admin/transfer-certificates" className="link">
                      <span className="link-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={192} height={192} fill="currentColor" viewBox="0 0 256 256">
                          <rect width={256} height={256} fill="none" />
                          <path
                            d="M45.42853,176.99811A95.95978,95.95978,0,1,1,79.00228,210.5717l.00023-.001L45.84594,220.044a8,8,0,0,1-9.89-9.89l9.47331-33.15657Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={16}
                          />
                        </svg>
                      </span>
                      <span className="link-title">Certificates</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="user-section">
                <div className="user-name">
                  <span>{currentUser.name}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </StyledNavbar>
  );
};

const StyledNavbar = styled.nav`
  background: #1a237e;
  padding: 0.75rem 0;
  margin-bottom: 1.5rem;
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .navbar-brand {
    font-size: 1.4rem;
    font-weight: bold;
    
    .brand-link {
      color: white;
      text-decoration: none;
      
      &:hover {
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }
  
  .navbar-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .menu {
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    display: flex;
    justify-content: center;
    border-radius: 15px;
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  }

  .link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 50px;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transform-origin: center left;
    transition: width 0.2s ease-in;
    text-decoration: none;
    color: white;
    
    &:before {
      position: absolute;
      z-index: -1;
      content: "";
      display: block;
      border-radius: 8px;
      width: 100%;
      height: 100%;
      top: 0;
      transform: translateX(100%);
      transition: transform 0.2s ease-in;
      transform-origin: center right;
      background-color: rgba(255, 255, 255, 0.1);
    }

    &:hover,
    &:focus {
      outline: 0;
      width: 130px;

      &:before,
      .link-title {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  .link-icon {
    width: 28px;
    height: 28px;
    display: block;
    flex-shrink: 0;
    left: 18px;
    position: absolute;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }

  .link-title {
    transform: translateX(100%);
    transition: transform 0.2s ease-in;
    transform-origin: center right;
    display: block;
    text-align: center;
    text-indent: 28px;
    width: 100%;
    opacity: 0.8;
  }
  
  .user-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .user-name {
      color: white;
      font-weight: 500;
    }
    
    .logout-btn {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }
  }
  
  @media (max-width: 992px) {
    .navbar-container {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .navbar-content {
      flex-direction: column;
      gap: 1rem;
    }
    
    .user-section {
      margin-top: 0.5rem;
    }
  }
`;

export default AppNavbar