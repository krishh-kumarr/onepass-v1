import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getAcademicRecords } from '../../services/studentService';
import AcademicRecordsView from '../shared/AcademicRecordsView';

const AcademicRecords = () => {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademicRecords = async () => {
      if (!currentUser || !currentUser.id) {
        console.error('Current user or user ID is missing', currentUser);
        setError('User authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching academic records for user ID:', currentUser.id);
        
        // Add a small delay to ensure API is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = await getAcademicRecords(currentUser.id);
        console.log('Fetched academic records:', data);
        
        // Check if data exists
        if (!data) {
          console.error('No data returned from API');
          setError('Failed to fetch academic records data from server');
          setRecords([]);
          return;
        }
        
        // Check if academicRecords property exists
        if (!data.academicRecords) {
          console.error('No academicRecords property in response data', data);
          
          // If data is an array, it might be the records directly
          if (Array.isArray(data)) {
            console.log('Data is an array, using it directly as records');
            setRecords(data);
          } else {
            setError('Academic records data structure is incorrect');
            setRecords([]);
          }
        } else {
          // Normal case - data.academicRecords exists
          console.log('Records array:', data.academicRecords);
          setRecords(Array.isArray(data.academicRecords) ? data.academicRecords : []);
        }
      } catch (err) {
        console.error('Error fetching academic records:', err);
        setError('Failed to load academic records: ' + (err.message || 'Unknown error'));
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicRecords();
  }, [currentUser]);

  const handleExport = (recordsToExport) => {
    alert('PDF export functionality would be implemented here');
    console.log('Records to export:', recordsToExport);
  };

  console.log('Rendering academic records component with', records.length, 'records');
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  // Create sample data for demonstration if no records are available
  const createSampleData = () => {
    return [
      {
        record_id: 'sample1',
        subject: 'Mathematics',
        marks: '85',
        percentage: '85',
        grade: 'A',
        school_standard: '10th',
        academic_year: '2024-2025'
      },
      {
        record_id: 'sample2',
        subject: 'Science',
        marks: '92',
        percentage: '92',
        grade: 'A+',
        school_standard: '10th',
        academic_year: '2024-2025'
      },
      {
        record_id: 'sample3',
        subject: 'English',
        marks: '78',
        percentage: '78',
        grade: 'B+',
        school_standard: '10th',
        academic_year: '2024-2025'
      }
    ];
  };

  // Use actual records if available, otherwise use sample data
  const displayRecords = records.length > 0 ? records : createSampleData();

  return (
    <div className="p-4">
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error Loading Records</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-primary">Loading your academic records...</p>
        </div>
      ) : (
        <AcademicRecordsView 
          academicRecords={displayRecords}
          loading={false}
          error={null}
          onExport={handleExport}
          showTitle={true}
          showExport={true}
        />
      )}
    </div>
  );
};

export default AcademicRecords;