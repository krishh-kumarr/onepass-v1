import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal } from 'react-bootstrap';
import { getAllTransferCertificates, updateTransferCertificate } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const TransferCertificates = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');

  // Fetch certificates on component mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  // Fetch Transfer Certificates with Error Handling
  const fetchCertificates = async () => {
    try {
      const data = await getAllTransferCertificates();
      console.log("Fetched Certificates:", data); // Debugging
      setCertificates(data.transferCertificates || []);  // Ensure it's an array
    } catch (err) {
      setError("Failed to load transfer certificates");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open Modal to Process Certificate
  const handleProcessCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setStatus(certificate.status || 'pending');
    setComments(certificate.comments || '');
    setShowModal(true);
  };

  // Submit Updated Certificate Status
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCertificate) return;

    try {
      await updateTransferCertificate(selectedCertificate.tc_id, {
        status,
        comments,
        processed_by: currentUser?.name || 'Admin'
      });

      setShowModal(false);
      fetchCertificates(); // Refresh data
    } catch (err) {
      console.error('Error updating certificate:', err);
      setError('Failed to update transfer certificate');
    }
  };

  // Helper Function for Status Badges
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

  // Show Loading State
  if (loading) return <div className="text-center p-5">Loading transfer certificates...</div>;

  // Show Error Message if API Call Fails
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Transfer Certificates Management</h1>
      
      <Card className="shadow">
        <Card.Header as="h5" className="bg-primary text-white">
          Transfer Certificate Applications
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Application Date</th>
                  <th>Destination School</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <tr key={cert.tc_id}>
                      <td>{cert.tc_id}</td>
                      <td>{cert.student_name || 'N/A'}</td>
                      <td>{cert.application_date ? new Date(cert.application_date).toLocaleDateString() : 'N/A'}</td>
                      <td>{cert.destination_school || 'N/A'}</td>
                      <td>{getStatusBadge(cert.status)}</td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleProcessCertificate(cert)}
                        >
                          {cert.status === 'pending' ? 'Process' : 'View/Update'}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No transfer certificate applications available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Process Certificate Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCertificate?.status === 'pending' ? 'Process Transfer Certificate' : 'View Transfer Certificate'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {selectedCertificate && (
              <>
                <div className="mb-3">
                  <strong>Student:</strong> {selectedCertificate.student_name || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Application Date:</strong> {selectedCertificate.application_date ? new Date(selectedCertificate.application_date).toLocaleDateString() : 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Destination School:</strong> {selectedCertificate.destination_school || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Reason:</strong> {selectedCertificate.reason || 'Not provided'}
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferCertificates;
