import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Loader from './components/Loader';
// Common components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/Login';
import Unauthorized from './components/common/Unauthorized';

// Student components
import StudentDashboard from './components/student/Dashboard';
import StudentProfile from './components/student/Profile';
import AcademicRecords from './components/student/AcademicRecords';
import Documents from './components/student/Documents';
import TransferCertificate from './components/student/TransferCertificate';
import Schemes from './components/student/Schemes';

// Admin components
import AdminDashboard from './components/admin/Dashboard';
import StudentsList from './components/admin/StudentsList';
import AdminTransferCertificates from './components/admin/TransferCertificates';
import Schools from './components/admin/Schools';

// NavbarWrapper component to conditionally render Navbar
const NavbarWrapper = () => {
  const location = useLocation();
  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }
  return <Navbar />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an async operation, such as fetching user data or other initial setup
    setTimeout(() => setLoading(false), 3000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={
            <>
              <NavbarWrapper />
              <div className="container-fluid">
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="unauthorized" element={<Unauthorized />} />
                  
                  {/* Student Routes */}
                  <Route path="student" element={<ProtectedRoute userType="student" />}>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="academic-records" element={<AcademicRecords />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="transfer-certificate" element={<TransferCertificate />} />
                    <Route path="schemes" element={<Schemes />} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route path="admin" element={<ProtectedRoute userType="admin" />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="students" element={<StudentsList />} />
                    <Route path="transfer-certificates" element={<AdminTransferCertificates />} />
                    <Route path="schools" element={<Schools />} />
                  </Route>
                  
                  <Route path="" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider> 
  );
}

export default App;