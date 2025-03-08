import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile } from '../../services/studentService';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile(currentUser.id);
        setProfile(data.profile);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser.id]);

  if (loading) return <div className="text-center p-5">Loading profile...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">My Profile</h1>
      
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow mb-4">
            <Card.Header as="h5" className="bg-primary text-white">
              Personal Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                    <span className="display-4 text-secondary">{profile.name.charAt(0)}</span>
                  </div>
                </Col>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Student ID:</strong> {profile.student_id}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Name:</strong> {profile.name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Gender:</strong> {profile.gender || 'Not specified'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Contact:</strong> {profile.contact_info}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {profile.address || 'Not specified'}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow">
            <Card.Header as="h5" className="bg-info text-white">
              Academic Information
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Current School:</strong> {profile.school_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Enrollment Date:</strong> {profile.enrollment_date ? new Date(profile.enrollment_date).toLocaleDateString() : 'Not specified'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Current Class/Grade:</strong> {profile.current_class || 'Not specified'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Section:</strong> {profile.section || 'Not specified'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Roll Number:</strong> {profile.roll_number || 'Not specified'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;