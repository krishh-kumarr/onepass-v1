import React, { useState, useEffect } from 'react';
import { Card, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getAcademicRecords } from '../../services/studentService';

const AcademicRecords = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicRecords = async () => {
      try {
        const data = await getAcademicRecords(currentUser.id);
        setRecords(data.academicRecords);
      } catch (err) {
        setError('Failed to load academic records');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicRecords();
  }, [currentUser.id]);

  if (loading) return <div className="text-center p-5">Loading academic records...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Academic Records</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow">
        <Card.Header as="h5" className="bg-success text-white">
          Academic Performance
        </Card.Header>
        <Card.Body>
          {records.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>GPA</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.record_id}>
                    <td>{record.year}</td>
                    <td>{record.semester}</td>
                    <td>
                      <strong>{record.gpa}</strong>
                    </td>
                    <td>{record.grade}</td>
                    <td>{record.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No academic records available.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AcademicRecords;