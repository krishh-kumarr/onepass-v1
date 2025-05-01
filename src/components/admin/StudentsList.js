import React, { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Modal, Row, Col, Alert, Tabs, Tab, ListGroup, Accordion } from 'react-bootstrap';
import { getAllStudents, getComprehensiveStudentDetails, updateStudent } from '../../services/adminService';
import { FaDownload, FaChartBar, FaTable } from 'react-icons/fa';
import AcademicRecordsView from '../shared/AcademicRecordsView';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  
  // Student details modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  
  // Student edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // State for academic records and schemes
  const [academicRecords, setAcademicRecords] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [groupedRecords, setGroupedRecords] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [activeStandard, setActiveStandard] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      
      // Ensure all students have the same school name
      const studentsWithSchool = data.students.map(student => ({
        ...student,
        school_name: "PM SHRI Mahatma Gandhi Government School"
      }));
      
      setStudents(studentsWithSchool);
      setFilteredStudents(studentsWithSchool);
      setError(null);
    } catch (err) {
      setError('Failed to load students data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewDetails = async (studentId) => {
    try {
      setDetailsLoading(true);
      setDetailsError(null);
      console.log(`FETCHING DETAILS FOR STUDENT ID: ${studentId}`);
      
      // Use the comprehensive endpoint to get student details including academics
      const data = await getComprehensiveStudentDetails(studentId);
      console.log("COMPREHENSIVE STUDENT DATA RECEIVED:", data);
      
      if (!data || !data.student) {
        throw new Error("Invalid response format from server");
      }
      
      // Ensure school name is consistent
      const studentWithSchool = {
        ...data.student,
        school_name: "PM SHRI Mahatma Gandhi Government School"
      };
      
      // Set the student data
      setSelectedStudent(studentWithSchool);
      
      // Process the academic records - ensure we're handling the data correctly
      if (data.academicRecords && Array.isArray(data.academicRecords) && data.academicRecords.length > 0) {
        console.log(`ACADEMIC RECORDS FOUND: ${data.academicRecords.length} records`);
        console.log("Sample record:", data.academicRecords[0]);
        
        // Map the database field names directly to match the structure shown in the table
        const processedRecords = data.academicRecords.map(record => {
          return {
            id: record.record_id || record.id,
            studentId: record.student_id,
            subject: record.subject,
            academic_year: '2023-2024', // Derived from the academic year
            school_standard: record.school_standard || 'N/A',
            marks: parseFloat(record.marks || 0).toFixed(2),
            percentage: parseFloat(record.percentage || 0).toFixed(2),
            grade: record.grade || 'N/A',
            created_at: record.created_at
          };
        });
        
        setAcademicRecords(processedRecords);
      } else {
        console.warn("No academic records found in the response");
        setAcademicRecords([]);
      }
      
      // Set schemes data
      setSchemes(data.schemes || []);
      
      // Open the modal and show academic records tab
      setShowDetailsModal(true);
      setActiveTab('academic');
    } catch (err) {
      console.error("ERROR FETCHING STUDENT DETAILS:", err);
      setDetailsError('Failed to load student details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
  };
  
  // Helper functions for academic records
  const getGradeBadge = (grade) => {
    switch(grade) {
      case 'A+': return <Badge bg="success">A+</Badge>;
      case 'A': return <Badge bg="success">A</Badge>;
      case 'B+': return <Badge bg="primary">B+</Badge>;
      case 'B': return <Badge bg="primary">B</Badge>;
      case 'C+': return <Badge bg="warning">C+</Badge>;
      case 'C': return <Badge bg="warning">C</Badge>;
      case 'D': return <Badge bg="danger">D</Badge>;
      case 'F': return <Badge bg="danger">F</Badge>;
      default: return <Badge bg="secondary">{grade}</Badge>;
    }
  };

  const calculateAverage = (records) => {
    if (!records || records.length === 0) return 0;
    const sum = records.reduce((acc, record) => acc + parseFloat(record.marks), 0);
    return (sum / records.length).toFixed(2);
  };

  const calculateAveragePercentage = (records) => {
    if (!records || records.length === 0) return 0;
    const sum = records.reduce((acc, record) => acc + parseFloat(record.percentage), 0);
    return (sum / records.length).toFixed(2);
  };

  const prepareChartData = (records) => {
    if (!records) return [];
    return records.map(record => ({
      subject: record.subject,
      marks: parseFloat(record.marks),
      percentage: parseFloat(record.percentage),
    }));
  };

  const handleExportPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF export functionality would be implemented here');
    console.log('Records to export:', academicRecords);
  };

  const renderStandardSummary = (standard, standardRecords) => {
    const avgMarks = calculateAverage(standardRecords);
    const avgPercentage = calculateAveragePercentage(standardRecords);
    
    return (
      <div className="standard-summary p-3 mb-4 bg-light rounded">
        <h4>{standard} Summary</h4>
        <Row className="mt-3">
          <Col md={4}>
            <div className="text-center">
              <h5>Average Marks</h5>
              <div className="display-6">{avgMarks}</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <h5>Average Percentage</h5>
              <div className="display-6">{avgPercentage}%</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <h5>Subjects</h5>
              <div className="display-6">{standardRecords.length}</div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const handleEditClick = (student) => {
    setEditedStudent({
      ...student,
      dob: student.dob ? student.dob.split('T')[0] : '' // Format date for input field
    });
    setUpdateError(null);
    setUpdateSuccess(false);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      const data = {
        name: editedStudent.name,
        dob: editedStudent.dob,
        contact_info: editedStudent.contact_info
      };
      
      await updateStudent(editedStudent.student_id, data);
      
      // Update the student in the list
      const updatedStudents = students.map(s => 
        s.student_id === editedStudent.student_id ? 
        { ...s, name: editedStudent.name, dob: editedStudent.dob, contact_info: editedStudent.contact_info } : 
        s
      );
      
      setStudents(updatedStudents);
      setFilteredStudents(
        searchTerm.trim() === '' ? 
        updatedStudents : 
        updatedStudents.filter(student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.student_id.toString().includes(searchTerm)
        )
      );
      
      setUpdateSuccess(true);
      
      // Close modal after 1 second to show success message
      setTimeout(() => {
        setShowEditModal(false);
        setUpdateSuccess(false);
      }, 1000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update student');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to get status badge for schemes
  const getSchemeBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'completed':
        return <Badge bg="primary">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

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
                      <td>{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</td>
                      <td><Badge bg="info">PM SHRI Mahatma Gandhi Government School</Badge></td>
                      <td>{student.contact_info || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="info" 
                            size="sm" 
                            onClick={() => handleViewDetails(student.student_id)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => handleEditClick(student)}
                          >
                            Edit
                          </Button>
                        </div>
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

      {/* Student Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
        backdropClassName="student-details-backdrop"
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Student Details - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {detailsLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading student details...</p>
            </div>
          ) : detailsError ? (
            <Alert variant="danger">{detailsError}</Alert>
          ) : selectedStudent && (
            <div>
              <Row className="m-3 mb-4">
                <Col md={4}>
                  <div className="d-flex justify-content-center">
                    <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', fontSize: '60px' }}>
                      {selectedStudent.name.charAt(0)}
                    </div>
                  </div>
                </Col>
                <Col md={8}>
                  <h3>{selectedStudent.name}</h3>
                  <p className="text-muted mb-2">
                    Student ID: <Badge bg="secondary">{selectedStudent.student_id}</Badge>
                  </p>
                  <p className="text-muted mb-2">
                    Username: {selectedStudent.username}
                  </p>
                  <p className="mb-1">
                    <Badge bg="info">PM SHRI Mahatma Gandhi Government School</Badge>
                  </p>
                </Col>
              </Row>

              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)} 
                className="mb-0"
                fill
              >
                <Tab eventKey="personal" title="Personal Information">
                  <div className="p-3">
                    <Row className="mt-4">
                      <Col md={6}>
                        <div className="border rounded p-3 mb-3">
                          <h5 className="border-bottom pb-2">Personal Information</h5>
                          <p><strong>Date of Birth:</strong> {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'Not provided'}</p>
                          <p><strong>Contact:</strong> {selectedStudent.contact_info || 'Not provided'}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="border rounded p-3 mb-3">
                          <h5 className="border-bottom pb-2">Account Information</h5>
                          <p><strong>Created:</strong> {selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleDateString() : 'Not available'}</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="academic" title="Academic Records">
                  <div className="p-3">
                    <AcademicRecordsView 
                      academicRecords={academicRecords}
                      showTitle={false}
                      showExport={true}
                      error={detailsError}
                      onExport={handleExportPDF}
                    />
                  </div>
                </Tab>
                
                <Tab eventKey="schemes" title="Government Schemes">
                  <div className="p-3">
                    {schemes.length > 0 ? (
                      <ListGroup>
                        {schemes.map((scheme) => (
                          <ListGroup.Item key={scheme.history_id} className="mb-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5>{scheme.scheme_name}</h5>
                              {getSchemeBadge(scheme.status)}
                            </div>
                            {scheme.description && (
                              <p className="text-muted small mb-2">{scheme.description}</p>
                            )}
                            <div className="d-flex justify-content-between small">
                              <span>
                                <strong>Start Date:</strong> {new Date(scheme.start_date).toLocaleDateString()}
                              </span>
                              <span>
                                <strong>End Date:</strong> {scheme.end_date ? new Date(scheme.end_date).toLocaleDateString() : 'Ongoing'}
                              </span>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted">No government schemes enrolled for this student.</p>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button variant="warning" onClick={() => {
            setShowDetailsModal(false);
            if (selectedStudent) {
              handleEditClick(selectedStudent);
            }
          }}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Student Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateLoading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Saving changes...</span>
              </div>
              <p className="mt-2">Saving changes...</p>
            </div>
          ) : editedStudent && (
            <Form>
              {updateError && <Alert variant="danger">{updateError}</Alert>}
              {updateSuccess && <Alert variant="success">Student updated successfully!</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editedStudent.name || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={editedStudent.dob || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact Information</Form.Label>
                <Form.Control
                  type="text"
                  name="contact_info"
                  value={editedStudent.contact_info || ''}
                  onChange={handleEditChange}
                  placeholder="Phone number or email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>School</Form.Label>
                <Form.Control
                  type="text"
                  value="PM SHRI Mahatma Gandhi Government School"
                  disabled
                />
                <Form.Text className="text-muted">
                  School cannot be changed as per policy.
                </Form.Text>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveChanges}
            disabled={updateLoading}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentsList;