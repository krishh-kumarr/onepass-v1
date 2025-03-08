import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  return (
    <div className="bg-dark sidebar py-3">
      <div className="d-flex flex-column px-3">
        <div className="text-center mb-4">
          <div className="bg-primary rounded-circle mx-auto d-flex align-items-center justify-content-center" 
               style={{ width: '60px', height: '60px' }}>
            <span className="text-white fw-bold fs-4">{currentUser.name.charAt(0)}</span>
          </div>
          <h6 className="text-white mt-2">{currentUser.name}</h6>
          <p className="text-muted small mb-0">{currentUser.userType}</p>
        </div>
        
        <Nav className="flex-column">
          {currentUser.userType === 'student' ? (
            <>
              <Nav.Link 
                as={Link} 
                to="/student/dashboard" 
                className={`text-white ${location.pathname === '/student/dashboard' ? 'active-link' : ''}`}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/student/profile" 
                className={`text-white ${location.pathname === '/student/profile' ? 'active-link' : ''}`}
              >
                My Profile
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/student/academic-records" 
                className={`text-white ${location.pathname === '/student/academic-records' ? 'active-link' : ''}`}
              >
                Academic Records
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/student/documents" 
                className={`text-white ${location.pathname === '/student/documents' ? 'active-link' : ''}`}
              >
                Documents
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/student/transfer-certificate" 
                className={`text-white ${location.pathname === '/student/transfer-certificate' ? 'active-link' : ''}`}
              >
                Transfer Certificate
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/student/schemes" 
                className={`text-white ${location.pathname === '/student/schemes' ? 'active-link' : ''}`}
              >
                Schemes
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link 
                as={Link} 
                to="/admin/dashboard" 
                className={`text-white ${location.pathname === '/admin/dashboard' ? 'active-link' : ''}`}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/students" 
                className={`text-white ${location.pathname === '/admin/students' ? 'active-link' : ''}`}
              >
                Students
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/transfer-certificates" 
                className={`text-white ${location.pathname === '/admin/transfer-certificates' ? 'active-link' : ''}`}
              >
                Transfer Certificates
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/schools" 
                className={`text-white ${location.pathname === '/admin/schools' ? 'active-link' : ''}`}
              >
                Schools
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;