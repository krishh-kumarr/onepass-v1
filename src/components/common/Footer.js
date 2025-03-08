import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div>
            <h5>School Management System</h5>
            <p className="text-muted mb-0">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          <div className="mt-3 mt-md-0">
            <a href="#" className="text-white me-3">Terms of Service</a>
            <a href="#" className="text-white me-3">Privacy Policy</a>
            <a href="#" className="text-white">Contact Us</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;