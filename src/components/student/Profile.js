import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, getAcademicRecords } from '../../services/studentService';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [academicRecords, setAcademicRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both profile and academic records to get current grade information
        const profileData = await getStudentProfile(currentUser.id);
        const academicData = await getAcademicRecords(currentUser.id);
        
        setProfile(profileData.profile);
        setAcademicRecords(academicData.academicRecords || []);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  // Get current grade from academic records, sort by standard and find the latest
  const getCurrentGrade = () => {
    if (!academicRecords || academicRecords.length === 0) {
      return profile.current_class || 'Not specified';
    }
    
    // Group records by school_standard for easier processing
    const standardsMap = academicRecords.reduce((acc, record) => {
      if (!acc[record.school_standard]) {
        acc[record.school_standard] = [];
      }
      acc[record.school_standard].push(record);
      return acc;
    }, {});
    
    // Get the highest standard (most recent grade)
    const standards = Object.keys(standardsMap).sort((a, b) => b - a);
    return standards.length > 0 ? `Grade ${standards[0]}` : (profile.current_class || 'Not specified');
  };

  // Get the student's section
  const getSection = () => {
    return profile.section || 'A';
  };
  
  // Get the student's roll number
  const getRollNumber = () => {
    return profile.roll_number || `${profile.student_id}`;
  };

  // Get gender with default value
  const getGender = () => {
    return profile.gender || 'Male';
  };

  // Get address with default value
  const getAddress = () => {
    return profile.address || '123 Student Housing, PM SHRI School Campus, Tamil Nadu';
  };

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
                      <strong>Gender:</strong> {getGender()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Contact:</strong> {profile.contact_info}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {getAddress()}
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
                  <strong>Current School:</strong> PM SHRI Mahatma Gandhi Government School
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Enrollment Date:</strong> {profile.enrollment_date ? new Date(profile.enrollment_date).toLocaleDateString() : '6/1/2020'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Current Class/Grade:</strong> {getCurrentGrade()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Section:</strong> {getSection()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Roll Number:</strong> {getRollNumber()}
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