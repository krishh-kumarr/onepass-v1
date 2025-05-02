import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';

const AppNavbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // Function to handle redirect based on user type
  const handleTitleClick = (e) => {
    e.preventDefault();
    if (currentUser) {
      // Redirect to appropriate dashboard based on user type
      if (currentUser.userType === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  };

  return (
    <StyledNavbar className={scrolled ? 'scrolled' : ''}>
      <Container fluid>
        <div className="navbar-container">
          <div className="navbar-brand">
            <a href="#" onClick={handleTitleClick} className="brand-link">
              <LogoText>
                <span className="one">One</span>
                <span className="pass">Pass</span>
                <span className="for-students">
                  {currentUser?.userType === 'student' ? 'for Students' : 'for Administrators'}
                </span>
              </LogoText>
            </a>
          </div>

          {currentUser && (
            <div className="navbar-content">
              <div className="menu">
                {currentUser.userType === 'student' ? (
                  <>
                    <Link to="/student/dashboard" className={`link ${location.pathname.includes('/student/dashboard') ? 'active' : ''}`}>
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
                    <Link to="/student/profile" className={`link ${location.pathname.includes('/student/profile') ? 'active' : ''}`}>
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
                    <Link to="/student/academic-records" className={`link ${location.pathname.includes('/student/academic-records') ? 'active' : ''}`}>
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
                    <Link to="/student/documents" className={`link ${location.pathname.includes('/student/documents') ? 'active' : ''}`}>
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
                    <Link to="/admin/dashboard" className={`link ${location.pathname.includes('/admin/dashboard') ? 'active' : ''}`}>
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
                    <Link to="/admin/students" className={`link ${location.pathname.includes('/admin/students') ? 'active' : ''}`}>
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
                    <Link to="/admin/schools" className={`link ${location.pathname.includes('/admin/schools') ? 'active' : ''}`}>
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
                    <Link to="/admin/transfer-certificates" className={`link ${location.pathname.includes('/admin/transfer-certificates') ? 'active' : ''}`}>
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
                <div className="user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    <span>{currentUser.name}</span>
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </StyledNavbar>
  );
};

const LogoText = styled.div`
  display: flex;
  align-items: baseline;
  
  .one {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .pass {
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
  }
  
  .for-students {
    font-size: 0.85rem;
    margin-left: 6px;
    font-weight: 400;
    opacity: 0.7;
    color: white;
  }
`;

const StyledNavbar = styled.nav`
  background: linear-gradient(135deg, #1a237e, #4a148c);
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &.scrolled {
    padding: 0.75rem 0;
    background: rgba(26, 35, 126, 0.97);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
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
    &:focus,
    &.active {
      outline: 0;
      width: 130px;

      &:before,
      .link-title {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    &.active {
      background: rgba(255, 255, 255, 0.2);
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
    
    .user-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .logout-btn {
      background: none;
      color: rgba(255, 255, 255, 0.7);
      border: none;
      padding: 0;
      font-size: 0.75rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      
      &:hover {
        color: rgba(255, 255, 255, 1);
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

export default AppNavbar;