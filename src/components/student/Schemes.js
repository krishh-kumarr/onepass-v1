import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getSchemes } from '../../services/studentService';

const Schemes = () => {
  const { currentUser } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await getSchemes(currentUser.id);
        setSchemes(data.schemes);
      } catch (err) {
        setError('Failed to load schemes data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [currentUser.id]);

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };

  if (loading) return <div className="text-center p-5">Loading schemes...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Government Schemes</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow">
        <Card.Header as="h5" className="bg-primary text-white">
          Your Enrolled Schemes
        </Card.Header>
        <Card.Body>
          {schemes.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Scheme Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Benefits</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((scheme) => (
                  <tr key={scheme.history_id}>
                    <td>{scheme.scheme_name}</td>
                    <td>{new Date(scheme.start_date).toLocaleDateString()}</td>
                    <td>
                      {scheme.end_date ? new Date(scheme.end_date).toLocaleDateString() : 'Ongoing'}
                    </td>
                    <td>{getStatusBadge(scheme.is_active)}</td>
                    <td>{scheme.benefits || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">You are not enrolled in any schemes.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Schemes;