import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container className="text-center p-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-5 bg-light rounded shadow">
            <h1 className="display-4 text-danger">Access Denied</h1>
            <p className="lead mb-4">
              You don't have permission to access this page.
            </p>
            <div>
              <Link to="/" className="btn btn-primary me-3">
                Go to Home
              </Link>
              <Button variant="secondary" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;