import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
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
      try {
        setLoading(true);
        const data = await getAcademicRecords(currentUser.id);
        console.log('Fetched academic records:', data.academicRecords);
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

  const handleExport = (recordsToExport) => {
    alert('PDF export functionality would be implemented here');
    console.log('Records to export:', recordsToExport);
  };

  return (
    <div className="p-4">
      <AcademicRecordsView 
        academicRecords={records}
        loading={loading}
        error={error}
        onExport={handleExport}
        showTitle={true}
        showExport={true}
      />
    </div>
  );
};

export default AcademicRecords;