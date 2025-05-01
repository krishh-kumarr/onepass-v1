import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { getAllSchools } from '../../services/adminService';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        // Get schools from API
        const data = await getAllSchools();
        
        // Check if PM SHRI Mahatma Gandhi Government School exists
        let pmShriSchool = data.schools.find(
          school => school.name === "PM SHRI Mahatma Gandhi Government School"
        );
        
        // If school doesn't exist in data, create a default entry
        if (!pmShriSchool) {
          pmShriSchool = {
            school_id: 1,
            name: "PM SHRI Mahatma Gandhi Government School",
            address: "Gandhi Road, City Center",
            contact_info: "pmshri@example.com",
            created_at: new Date().toISOString()
          };
        }
        
        // Only use this school
        setSchools([pmShriSchool]);
      } catch (err) {
        setError('Failed to load schools data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) return <div className="text-center p-5">Loading schools...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Schools Management</h1>
      
      <Alert variant="info" className="mb-4">
        <Alert.Heading>School Policy Update</Alert.Heading>
        <p>
          As per the new policy, all students are now assigned to <strong>PM SHRI Mahatma Gandhi Government School</strong>. 
          No other schools are available in the system.
        </p>
      </Alert>
      
      <Card className="shadow">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-0">Official School</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>School ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.school_id}>
                    <td>
                      <Badge bg="secondary">{school.school_id}</Badge>
                    </td>
                    <td><strong>{school.name}</strong></td>
                    <td>{school.address || '-'}</td>
                    <td>{school.contact_info || '-'}</td>
                    <td>
                      <Badge bg="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Schools;