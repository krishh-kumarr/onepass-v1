import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, getAcademicRecords, getTransferCertificates } from '../../services/studentService';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getStudentProfile(currentUser.id);
        const academicData = await getAcademicRecords(currentUser.id);
        const certificatesData = await getTransferCertificates(currentUser.id);
        
        setProfile(profileData.profile);
        setRecords(academicData.academicRecords);
        setCertificates(certificatesData.transferCertificates);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4">Student Dashboard</h1>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header as="h5" className="bg-info text-white">
              Student Information
            </Card.Header>
            <Card.Body>
              {profile && (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Name:</strong> {profile.name}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>School:</strong> {profile.school_name}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Contact:</strong> {profile.contact_info}
                  </ListGroup.Item>
                </ListGroup>
              )}
              <Link to="/student/profile" className="btn btn-outline-primary mt-3">
                View Full Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header as="h5" className="bg-success text-white">
              Recent Academic Records
            </Card.Header>
            <Card.Body>
              {records.length > 0 ? (
                <ListGroup variant="flush">
                  {records.slice(0, 3).map((record) => (
                    <ListGroup.Item key={record.record_id}>
                      <div className="d-flex justify-content-between">
                        <span>
                          <strong>Year {record.year}, {record.semester}</strong>
                        </span>
                        <span>GPA: {record.gpa}</span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No academic records available.</p>
              )}
              <Link to="/student/academic-records" className="btn btn-outline-success mt-3">
                View All Records
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header as="h5" className="bg-warning text-dark">
              Transfer Certificates
            </Card.Header>
            <Card.Body>
              {certificates.length > 0 ? (
                <ListGroup variant="flush">
                  {certificates.slice(0, 3).map((cert) => (
                    <ListGroup.Item key={cert.tc_id}>
                      <div className="d-flex justify-content-between">
                        <span>{cert.destination_school}</span>
                        <span className={`badge ${cert.status === 'approved' ? 'bg-success' : cert.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                          {cert.status}
                        </span>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No transfer certificates available.</p>
              )}
              <Link to="/student/transfer-certificate" className="btn btn-outline-warning mt-3">
                Manage Transfer Certificates
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="shadow h-100">
            <Card.Header as="h5" className="bg-secondary text-white">
              Quick Links
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Link to="/student/documents" className="btn btn-outline-primary">
                  Manage Documents
                </Link>
                <Link to="/student/schemes" className="btn btn-outline-success">
                  View Schemes
                </Link>
                <Link to="/student/transfer-certificate" className="btn btn-outline-info">
                  Apply for Transfer Certificate
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;