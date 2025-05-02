import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, getAcademicRecords, getTransferCertificates } from '../../services/studentService';
import { Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { ProgressBar, Badge as RBBadge } from 'react-bootstrap';
import { FaGraduationCap, FaStar } from 'react-icons/fa';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
    margin: 0;
    padding: 0;
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.8s ease;
`;

const PageTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 2px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1rem;
`;

const Column = styled.div`
  flex: 0 0 calc(50% - 2rem);
  margin: 0 1rem 2rem;
  
  @media (max-width: 768px) {
    flex: 0 0 calc(100% - 2rem);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 1.2rem 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.2rem;
  
  background: ${props => {
    switch(props.type) {
      case 'info': return 'linear-gradient(135deg, #42a5f5, #2196f3)';
      case 'success': return 'linear-gradient(135deg, #66bb6a, #4caf50)';
      case 'warning': return 'linear-gradient(135deg, #ffb74d, #ff9800)';
      default: return 'linear-gradient(135deg, #78909c, #607d8b)';
    }
  }};
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(236, 240, 241, 0.5);
  }
`;

const Badge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch(props.status) {
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#ff9800';
    }
  }};
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  margin-top: 1rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  background-color: transparent;
  color: ${props => props.variant || '#3498db'};
  border: 2px solid ${props => props.variant || '#3498db'};
  
  &:hover {
    background-color: ${props => props.variant || '#3498db'};
    color: white;
    transform: translateY(-2px);
  }
`;

const QuickLinkButton = styled(Link)`
  display: block;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  text-align: center;
  margin-bottom: 1rem;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  background: ${props => {
    switch(props.variant) {
      case 'primary': return 'linear-gradient(135deg, #42a5f5, #2196f3)';
      case 'success': return 'linear-gradient(135deg, #66bb6a, #4caf50)';
      case 'info': return 'linear-gradient(135deg, #26c6da, #00bcd4)';
      default: return 'linear-gradient(135deg, #78909c, #607d8b)';
    }
  }};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.15);
    animation: ${pulse} 0.8s infinite alternate;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #3498db;
  font-weight: 500;
`;

// Main Component
const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedRecords, setGroupedRecords] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getStudentProfile(currentUser.id);
        const academicData = await getAcademicRecords(currentUser.id);
        const certificatesData = await getTransferCertificates(currentUser.id);
        
        setProfile(profileData.profile);
        console.log('Academic records data:', academicData);
        
        // Set the full records array
        if (academicData && academicData.academicRecords) {
          setRecords(academicData.academicRecords);
          
          // Group records by academic_year and school_standard for better organization
          const grouped = academicData.academicRecords.reduce((acc, record) => {
            // Create a unique key using academic_year and school_standard
            const yearKey = record.academic_year || 'Unknown';
            const standardKey = record.school_standard || 'Unknown';
            const key = `${yearKey}-${standardKey}`;
            
            if (!acc[key]) {
              acc[key] = {
                academic_year: yearKey,
                school_standard: standardKey,
                records: []
              };
            }
            acc[key].records.push(record);
            return acc;
          }, {});
          
          setGroupedRecords(grouped);
        }
        
        setCertificates(certificatesData.transferCertificates);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  // Helper function for grade colors
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

  // Calculate top performer subject
  const getTopPerformingSubject = () => {
    if (!records || records.length === 0) return { subject: 'N/A', marks: 0 };
    
    let highestMarks = 0;
    let topSubject = '';
    
    records.forEach(record => {
      const marks = parseFloat(record.marks) || 0;
      if (marks > highestMarks) {
        highestMarks = marks;
        topSubject = record.subject;
      }
    });
    
    return { subject: topSubject, marks: highestMarks };
  };

  // Calculate average percentage
  const getAveragePerformance = () => {
    if (!records || records.length === 0) return 0;
    
    const totalPercentage = records.reduce((sum, record) => {
      return sum + (parseFloat(record.percentage) || 0);
    }, 0);
    
    return (totalPercentage / records.length).toFixed(1);
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>Loading your dashboard...</LoadingText>
      </LoadingWrapper>
    );
  }

  const topSubject = getTopPerformingSubject();
  const averagePerformance = getAveragePerformance();

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <PageTitle>Student Dashboard</PageTitle>
        
        <Row>
          <Column>
            <Card>
              <CardHeader type="info">
                Student Information
              </CardHeader>
              <CardBody>
                {profile && (
                  <List>
                    <ListItem>
                      <strong>Name:</strong> {profile.name}
                    </ListItem>
                    <ListItem>
                      <strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
                    </ListItem>
                    <ListItem>
                      <strong>School:</strong> {profile.school_name}
                    </ListItem>
                    <ListItem>
                      <strong>Contact:</strong> {profile.contact_info}
                    </ListItem>
                  </List>
                )}
                <StyledLink to="/student/profile" variant="#2196f3">
                  View Full Profile
                </StyledLink>
              </CardBody>
            </Card>
          </Column>
          
          <Column>
            <Card>
              <CardHeader type="success">
                Academic Performance
              </CardHeader>
              <CardBody>
                {records.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Overall Average</span>
                        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{averagePerformance}%</span>
                      </div>
                      <ProgressBar 
                        now={parseFloat(averagePerformance)} 
                        variant={parseFloat(averagePerformance) >= 70 ? "success" : parseFloat(averagePerformance) >= 50 ? "primary" : "warning"}
                        style={{ height: '8px', borderRadius: '4px' }}
                      />
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3">
                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', width: '48%' }}>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Top Subject</div>
                        <div style={{ fontWeight: 'bold', color: '#27ae60' }}>{topSubject.subject}</div>
                        <div style={{ fontSize: '0.8rem' }}>{topSubject.marks}/100</div>
                      </div>
                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', width: '48%' }}>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>Total Subjects</div>
                        <div style={{ fontWeight: 'bold', color: '#2980b9' }}>{records.length}</div>
                        <div style={{ fontSize: '0.8rem' }}>Across {Object.keys(groupedRecords).length} terms</div>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px', color: '#34495e' }}>Recent Performance</div>
                    
                    {records.slice(0, 3).map((record) => (
                      <div key={record.record_id || Math.random()} style={{ 
                        padding: '10px', 
                        marginBottom: '8px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        borderLeft: `4px solid ${record.grade && getGradeColor(record.grade) === 'success' ? '#4caf50' : 
                                              getGradeColor(record.grade) === 'primary' ? '#2196f3' : 
                                              getGradeColor(record.grade) === 'warning' ? '#ff9800' : 
                                              getGradeColor(record.grade) === 'danger' ? '#f44336' : '#95a5a6'}`
                      }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{record.subject}</div>
                            <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{record.school_standard} • {record.academic_year}</div>
                          </div>
                          <div className="text-end">
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{record.marks}/100</div>
                            <span className={`grade-pill grade-${getGradeColor(record.grade)}`} style={{ fontSize: '0.8rem' }}>
                              {record.grade}
                            </span>
                          </div>
                        </div>
                        <ProgressBar 
                          now={parseFloat(record.percentage)} 
                          variant={getGradeColor(record.grade)}
                          className="mt-2" 
                          style={{ height: '4px' }}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <FaStar className="text-warning mb-2" size={24} />
                    <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No academic records available.</p>
                  </div>
                )}
                <StyledLink to="/student/academic-records" variant="#4caf50">
                  View All Records
                </StyledLink>
              </CardBody>
            </Card>
          </Column>
        </Row>
        
        <Row>
          <Column>
            <Card>
              <CardHeader type="warning">
                Transfer Certificates
              </CardHeader>
              <CardBody>
                {certificates.length > 0 ? (
                  <List>
                    {certificates.slice(0, 3).map((cert) => (
                      <ListItem key={cert.tc_id}>
                        <span>{cert.destination_school}</span>
                        <Badge status={cert.status}>
                          {cert.status}
                        </Badge>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No transfer certificates available.</p>
                )}
                <StyledLink to="/student/transfer-certificate" variant="#ff9800">
                  Manage Transfer Certificates
                </StyledLink>
              </CardBody>
            </Card>
          </Column>
          
          <Column>
            <Card>
              <CardHeader>
                Quick Links
              </CardHeader>
              <CardBody>
                <QuickLinkButton to="/student/documents" variant="primary">
                  Manage Documents
                </QuickLinkButton>
                <QuickLinkButton to="/student/schemes" variant="success">
                  View Schemes
                </QuickLinkButton>
                <QuickLinkButton to="/student/transfer-certificate" variant="info">
                  Apply for Transfer Certificate
                </QuickLinkButton>
              </CardBody>
            </Card>
          </Column>
        </Row>
      </DashboardContainer>
    </>
  );
};

export default StudentDashboard;