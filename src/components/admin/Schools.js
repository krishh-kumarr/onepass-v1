import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { getAllSchools } from '../../services/adminService';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchools, setFilteredSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getAllSchools();
        setSchools(data.schools);
        setFilteredSchools(data.schools);
      } catch (err) {
        setError('Failed to load schools data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.location && school.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSchools(filtered);
    }
  }, [searchTerm, schools]);

  if (loading) return <div className="text-center p-5">Loading schools...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Schools Management</h1>
      
      <Card className="shadow">
        <Card.Header className="bg-info text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-0">Schools Directory</h5>
            <div className="d-flex">
              <InputGroup>
                <Form.Control
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="outline-light" onClick={() => setSearchTerm('')}>
                    ✕
                  </Button>
                )}
              </InputGroup>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>School ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Principal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <tr key={school.school_id}>
                      <td>
                        <Badge bg="secondary">{school.school_id}</Badge>
                      </td>
                      <td>{school.name}</td>
                      <td>{school.location || '-'}</td>
                      <td>{school.contact_info || '-'}</td>
                      <td>{school.principal_name || '-'}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">
                          View
                        </Button>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      {searchTerm ? "No matching schools found" : "No schools available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Schools;