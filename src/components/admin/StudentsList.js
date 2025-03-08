import React, { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { getAllStudents } from '../../services/adminService';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data.students);
        setFilteredStudents(data.students);
      } catch (err) {
        setError('Failed to load students data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toString().includes(searchTerm)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  if (loading) return <div className="text-center p-5">Loading students...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Students Management</h1>
      
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-0">Students List</h5>
            <div className="d-flex">
              <InputGroup>
                <Form.Control
                  placeholder="Search students..."
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
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>School</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.student_id}>
                      <td>
                        <Badge bg="secondary">{student.student_id}</Badge>
                      </td>
                      <td>{student.name}</td>
                      <td>{new Date(student.dob).toLocaleDateString()}</td>
                      <td>{student.school_name}</td>
                      <td>{student.contact_info}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">
                          View Details
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
                      {searchTerm ? "No matching students found" : "No students available"}
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

export default StudentsList;