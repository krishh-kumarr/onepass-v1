import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getTransferCertificates, applyForTransferCertificate } from '../../services/studentService';
import { Formik } from 'formik';
import * as Yup from 'yup';

const TransferCertificate = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await getTransferCertificates(currentUser.id);
      setCertificates(data.transferCertificates);
      setError(null);
    } catch (err) {
      setError('Failed to load transfer certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (values, { resetForm, setSubmitting }) => {
    try {
      await applyForTransferCertificate(currentUser.id, values);
      resetForm();
      setShowApplyModal(false);
      setApplySuccess('Transfer certificate application submitted successfully!');
      fetchCertificates();
    } catch (err) {
      setError('Failed to submit application');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
    
    setTimeout(() => {
      setApplySuccess('');
    }, 5000);
  };

  const validationSchema = Yup.object({
    destinationSchool: Yup.string().required('Destination school is required'),
    reason: Yup.string().required('Reason is required'),
    transferDate: Yup.date().required('Transfer date is required')
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="warning">Pending</Badge>;
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Transfer Certificate</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {applySuccess && <Alert variant="success">{applySuccess}</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="m-0">Your Transfer Certificate Applications</h5>
          <Button variant="light" onClick={() => setShowApplyModal(true)}>
            Apply for New Certificate
          </Button>
        </Card.Header>
        <Card.Body>
          {certificates.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Application Date</th>
                  <th>Destination School</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.tc_id}>
                    <td>{new Date(cert.application_date).toLocaleDateString()}</td>
                    <td>{cert.destination_school}</td>
                    <td>{cert.reason}</td>
                    <td>{getStatusBadge(cert.status)}</td>
                    <td>{cert.comments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No transfer certificate applications available.</p>
              <Button variant="primary" onClick={() => setShowApplyModal(true)}>
                Apply for Transfer Certificate
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Apply for Transfer Certificate Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for Transfer Certificate</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ destinationSchool: '', reason: '', transferDate: '' }}
          validationSchema={validationSchema}
          onSubmit={handleApply}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Destination School</Form.Label>
                  <Form.Control
                    type="text"
                    name="destinationSchool"
                    value={values.destinationSchool}
                    onChange={handleChange}
                    isInvalid={touched.destinationSchool && !!errors.destinationSchool}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationSchool}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Reason for Transfer</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    isInvalid={touched.reason && !!errors.reason}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.reason}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Requested Transfer Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="transferDate"
                    value={values.transferDate}
                    onChange={handleChange}
                    isInvalid={touched.transferDate && !!errors.transferDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.transferDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default TransferCertificate;