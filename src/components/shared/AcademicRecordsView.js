import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { FaDownload, FaChartLine, FaEye, FaStar, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AcademicRecordsView = ({ academicRecords = [], loading = false, error = null, onExport, showTitle = true, showExport = true }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState('doughnut');

  // Add debugging
  console.log('AcademicRecordsView Props:', {
    academicRecords,
    recordsLength: academicRecords?.length || 0,
    loading,
    error,
    showTitle,
    showExport
  });

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    console.log('Showing loading state');
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center my-5 py-5"
      >
        <div className="loading-animation">
          <FaGraduationCap className="loading-icon" size={40} />
          <div className="loading-progress">
            <ProgressBar animated now={45} variant="primary" className="mt-3" />
          </div>
          <p className="mt-3 text-primary fw-bold">Loading your academic journey...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    console.log('Showing error state:', error);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Oops! Something went wrong</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </motion.div>
    );
  }

  // Ensure we have an array to work with, even if it's empty
  const recordsArray = Array.isArray(academicRecords) ? academicRecords : [];
  console.log('Records array after validation:', recordsArray.length, recordsArray);

  // Check if we have any records to display
  if (recordsArray.length === 0) {
    console.log('No records to display, showing empty state');
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="warning" className="shadow border-0">
          <Alert.Heading>
            <FaStar className="me-2" />
            No Academic Records Found
          </Alert.Heading>
          <p>
            We couldn't find any academic records in the database for your profile.
          </p>
          <hr />
          <p className="mb-0">
            To update academic records, please contact your school administrator or check back later.
          </p>
        </Alert>
      </motion.div>
    );
  }

  // Group records by academic_year and school_standard for proper organization
  const groupedByYear = recordsArray.reduce((acc, record) => {
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
  
  console.log('Grouped by year:', groupedByYear);

  // Convert the grouped object into an array and sort by academic_year (desc) and school_standard (desc)
  const sortedGroups = Object.values(groupedByYear).sort((a, b) => {
    // First sort by academic year (descending)
    const yearA = a.academic_year || '';
    const yearB = b.academic_year || '';
    const yearCompare = yearB.localeCompare(yearA);
    
    if (yearCompare !== 0) return yearCompare;
    
    // Then sort by school standard (descending)
    const standardA = a.school_standard || '';
    const standardB = b.school_standard || '';
    
    // Handle numeric standard values (like '9th', '10th')
    const numA = parseInt(standardA, 10) || 0;
    const numB = parseInt(standardB, 10) || 0;
    
    return numB - numA;
  });
  
  console.log('Sorted groups:', sortedGroups);
  
  // Helper function for grade badge colors and animations
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
    if (!records || records.length === 0) return { avgMarks: 0, avgPercentage: 0, topSubject: null, gradeDistribution: {} };
    
    let totalMarks = 0;
    let totalPercentage = 0;
    let topSubjectScore = 0;
    let topSubject = null;
    const gradeDistribution = {};
    
    records.forEach(record => {
      const marks = parseFloat(record.marks) || 0;
      totalMarks += marks;
      totalPercentage += parseFloat(record.percentage) || 0;
      
      // Track top subject
      if (marks > topSubjectScore) {
        topSubjectScore = marks;
        topSubject = record.subject;
      }
      
      // Count grade distribution
      const grade = record.grade || 'N/A';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });
    
    return {
      avgMarks: (totalMarks / records.length).toFixed(2),
      avgPercentage: (totalPercentage / records.length).toFixed(2),
      topSubject,
      gradeDistribution
    };
  };

  // Generate chart data
  const generateChartData = (records) => {
    if (!records || records.length === 0) return null;
    
    // For doughnut chart (grade distribution)
    const gradeLabels = Object.keys(records.gradeDistribution);
    const gradeData = Object.values(records.gradeDistribution);
    
    // Colors based on grades
    const backgroundColors = gradeLabels.map(grade => {
      const colorMap = {
        'A+': 'rgba(40, 167, 69, 0.8)',
        'A': 'rgba(40, 167, 69, 0.6)',
        'B+': 'rgba(0, 123, 255, 0.8)',
        'B': 'rgba(0, 123, 255, 0.6)',
        'C+': 'rgba(255, 193, 7, 0.8)',
        'C': 'rgba(255, 193, 7, 0.6)',
        'D': 'rgba(220, 53, 69, 0.8)',
        'F': 'rgba(220, 53, 69, 0.6)',
        'N/A': 'rgba(108, 117, 125, 0.6)'
      };
      
      return colorMap[grade] || 'rgba(108, 117, 125, 0.6)';
    });
    
    return {
      doughnut: {
        labels: gradeLabels,
        datasets: [{
          data: gradeData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1
        }]
      },
      bar: {
        labels: selectedRecord?.records.map(r => r.subject) || [],
        datasets: [{
          label: 'Marks',
          data: selectedRecord?.records.map(r => r.marks) || [],
          backgroundColor: 'rgba(13, 110, 253, 0.7)',
          borderColor: 'rgba(13, 110, 253, 1)',
          borderWidth: 1
        }]
      }
    };
  };

  return (
    <motion.div 
      className="academic-records-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showTitle && (
        <motion.div
          className="d-flex align-items-center mb-4"
          variants={itemVariants}
        >
          <div className="academic-title-container">
            <h3 className="mb-0 me-2 d-inline">Academic Records</h3>
            <div className="academic-stats-pill d-inline-block ms-2">
              <Badge bg="primary" pill className="px-3 py-2">
                {recordsArray.length} Subject Records
              </Badge>
              <Badge bg="success" pill className="ms-2 px-3 py-2">
                {sortedGroups.length} Academic Terms
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
      
      <AnimatePresence>
        {selectedRecord && showChart && (
          <motion.div
            className="chart-container mb-4 p-3 bg-light rounded shadow-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="d-flex justify-content-between mb-3">
              <h5>Performance Analysis: {selectedRecord.school_standard}</h5>
              <div>
                <Button 
                  size="sm" 
                  variant={chartType === 'doughnut' ? 'primary' : 'outline-primary'}
                  onClick={() => setChartType('doughnut')}
                  className="me-2"
                >
                  Grade Distribution
                </Button>
                <Button 
                  size="sm" 
                  variant={chartType === 'bar' ? 'primary' : 'outline-primary'}
                  onClick={() => setChartType('bar')}
                >
                  Subject Performance
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-secondary" 
                  className="ms-2"
                  onClick={() => setShowChart(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div style={{ height: '300px' }}>
              {chartType === 'doughnut' ? (
                <Chart 
                  type="doughnut" 
                  data={generateChartData(selectedRecord)?.doughnut}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      title: {
                        display: true,
                        text: 'Grade Distribution'
                      }
                    }
                  }}
                />
              ) : (
                <Chart 
                  type="bar" 
                  data={generateChartData(selectedRecord)?.bar}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                      legend: {
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Subject Performance'
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sortedGroups.map((group, index) => {
        const { avgMarks, avgPercentage, topSubject, gradeDistribution } = calculateAverages(group.records);
        
        // Sort records by subject name
        const sortedRecords = [...group.records].sort((a, b) => 
          (a.subject || '').localeCompare(b.subject || '')
        );
        
        return (
          <motion.div
            className="mb-4"
            key={index}
            variants={itemVariants}
          >
            <Card 
              className="shadow-sm border-0 record-card"
              style={{ overflow: 'hidden' }}
            >
              <Card.Header className="bg-gradient-primary text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <FaGraduationCap className="me-2" size={20} />
                    <h5 className="m-0">
                      {group.school_standard} 
                      {group.academic_year !== 'Unknown' && ` (${group.academic_year})`}
                    </h5>
                  </div>
                  <div className="d-flex">
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setSelectedRecord({...group, gradeDistribution});
                        setShowChart(true);
                      }}
                    >
                      <FaChartLine className="me-1" /> Analytics
                    </Button>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="p-0">
                <div className="p-3 bg-light">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="score-card p-2 rounded bg-white shadow-sm mb-2 mb-md-0">
                        <h6 className="text-secondary mb-1">Average Score</h6>
                        <h4 className="text-primary mb-0">{avgMarks} <small className="text-muted">/ 100</small></h4>
                        <ProgressBar 
                          now={parseFloat(avgPercentage)} 
                          variant={parseFloat(avgPercentage) >= 70 ? "success" : parseFloat(avgPercentage) >= 50 ? "primary" : "warning"}
                          className="mt-2" 
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="top-subject p-2 rounded bg-white shadow-sm text-center mb-2 mb-md-0">
                        <h6 className="text-secondary mb-1">Best Subject</h6>
                        <h4 className="text-success mb-0">{topSubject || 'N/A'}</h4>
                        <small className="text-muted">Your strongest performance</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="grade-summary p-2 rounded bg-white shadow-sm">
                        <h6 className="text-secondary mb-1">Grade Summary</h6>
                        <div className="d-flex flex-wrap justify-content-center">
                          {Object.entries(gradeDistribution).map(([grade, count], i) => (
                            <Badge 
                              key={i} 
                              bg={getGradeColor(grade)} 
                              className="m-1 py-2 px-3 grade-badge"
                            >
                              {grade}: {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <Table hover className="academic-table mb-0">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRecords.map((record, idx) => (
                        <motion.tr 
                          key={record.id || idx}
                          initial={{ opacity: 0, backgroundColor: "#f8f9fa" }}
                          animate={{ opacity: 1, backgroundColor: "#ffffff" }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={{ 
                            backgroundColor: "#f8f9fa",
                            transition: { duration: 0.1 }
                          }}
                        >
                          <td className="subject-name">{record.subject}</td>
                          <td>
                            <div className="marks-display">
                              <span className="marks-value">{record.marks}</span>
                              <ProgressBar 
                                now={parseFloat(record.marks)} 
                                variant={getGradeColor(record.grade)}
                                className="mt-1" 
                                style={{ height: '5px' }}
                              />
                            </div>
                          </td>
                          <td>{record.percentage}%</td>
                          <td>
                            <motion.span 
                              className={`grade-pill grade-${getGradeColor(record.grade)}`}
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {record.grade}
                            </motion.span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        );
      })}
      
      {showExport && (
        <motion.div 
          className="d-flex justify-content-end mt-4"
          variants={itemVariants}
        >
          <Button 
            variant="primary" 
            className="export-button"
            onClick={() => onExport && onExport(recordsArray)}
          >
            <FaDownload className="me-2" /> Export Records
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AcademicRecordsView;