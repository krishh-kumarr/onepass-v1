import React from 'react';
import { Table, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';

const AcademicRecordsView = ({ academicRecords = [], loading = false, error = null, onExport, showTitle = true, showExport = true }) => {
  console.log("AcademicRecordsView received records:", academicRecords);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading academic records...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Ensure we have an array to work with, even if it's empty
  const recordsArray = Array.isArray(academicRecords) ? academicRecords : [];

  // Check if we have any records to display
  if (recordsArray.length === 0) {
    return (
      <Alert variant="warning">
        <Alert.Heading>No Academic Records Found</Alert.Heading>
        <p>
          The student's academic records could not be retrieved from the database.
        </p>
        <hr />
        <p className="mb-0">
          To update academic records, please use the school management system or contact the school administrator.
        </p>
      </Alert>
    );
  }

  // Group records by school standard
  const groupedByStandard = recordsArray.reduce((acc, record) => {
    const standard = record.school_standard || 'Unknown';
    
    if (!acc[standard]) {
      acc[standard] = [];
    }
    acc[standard].push(record);
    return acc;
  }, {});

  // Helper function for grade badge colors
  const getGradeColor = (grade) => {
    if (!grade || grade === 'N/A') return 'secondary';
    
    const gradeStr = String(grade).toUpperCase();
    
    if (gradeStr.includes('A+')) return 'success';
    if (gradeStr.includes('A')) return 'success';
    if (gradeStr.includes('B+')) return 'primary';
    if (gradeStr.includes('B')) return 'primary';
    if (gradeStr.includes('C+')) return 'warning';
    if (gradeStr.includes('C')) return 'warning';
    if (gradeStr.includes('D')) return 'danger';
    if (gradeStr.includes('F')) return 'danger';
    return 'secondary';
  };
  
  // Calculate average marks and percentage for a standard
  const calculateAverages = (records) => {
    if (!records || records.length === 0) return { avgMarks: 0, avgPercentage: 0 };
    
    let totalMarks = 0;
    let totalPercentage = 0;
    
    records.forEach(record => {
      totalMarks += parseFloat(record.marks) || 0;
      totalPercentage += parseFloat(record.percentage) || 0;
    });
    
    return {
      avgMarks: (totalMarks / records.length).toFixed(2),
      avgPercentage: (totalPercentage / records.length).toFixed(2)
    };
  };

  return (
    <div className="academic-records-container">
      {showTitle && <h3 className="mb-3">Academic Records</h3>}
      
      {Object.keys(groupedByStandard).sort().reverse().map(standard => {
        const standardRecords = groupedByStandard[standard];
        const { avgMarks, avgPercentage } = calculateAverages(standardRecords);
        
        return (
          <Card className="mb-4 shadow-sm" key={standard}>
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0">{standard}</h5>
                <div>
                  <span className="badge bg-light text-dark me-2">
                    Avg. Marks: {avgMarks}
                  </span>
                  <span className="badge bg-light text-dark">
                    Avg. Percentage: {avgPercentage}%
                  </span>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standardRecords.map((record, index) => (
                      <tr key={record.id || index}>
                        <td>{record.subject}</td>
                        <td>{record.marks}</td>
                        <td>{record.percentage}%</td>
                        <td>
                          <span className={`badge bg-${getGradeColor(record.grade)}`}>
                            {record.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        );
      })}
      
      {showExport && (
        <div className="d-flex justify-content-end mt-3">
          <Button 
            variant="primary" 
            onClick={() => onExport && onExport(recordsArray)}
          >
            <FaDownload className="me-2" /> Export Records
          </Button>
        </div>
      )}
    </div>
  );
};

export default AcademicRecordsView;