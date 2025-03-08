import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllStudents, getAllTransferCertificates, getAllSchools } from '../../services/adminService';
// Chart.js imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
// Lucide React icons
import { Users, FileCheck, Building2, ArrowRight, Loader2 } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: [],
    transferCertificates: [],
    schools: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching students...");
        const studentsData = await getAllStudents();
        
        console.log("Fetching transfer certificates...");
        const certificatesData = await getAllTransferCertificates();
        
        console.log("Fetching schools...");
        const schoolsData = await getAllSchools();
        
        setStats({
          students: studentsData.students || [],
          transferCertificates: certificatesData.transferCertificates || [],
          schools: schoolsData.schools || []
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Chart data preparation (unchanged)
  const transferChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Transfer Certificate Status',
        data: [
          stats.transferCertificates.filter(tc => tc.status === 'pending').length,
          stats.transferCertificates.filter(tc => tc.status === 'approved').length,
          stats.transferCertificates.filter(tc => tc.status === 'rejected').length,
        ],
        backgroundColor: [
          'rgba(234, 179, 8, 0.6)',  // Amber for pending
          'rgba(34, 197, 94, 0.6)',  // Green for approved
          'rgba(239, 68, 68, 0.6)',  // Red for rejected
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // School distribution chart
  const schoolDistribution = {};
  stats.students.forEach(student => {
    const schoolName = student.school_name || 'Unassigned';
    if (!schoolDistribution[schoolName]) {
      schoolDistribution[schoolName] = 0;
    }
    schoolDistribution[schoolName]++;
  });

  const schoolChartData = {
    labels: Object.keys(schoolDistribution),
    datasets: [
      {
        data: Object.values(schoolDistribution),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // Blue
          'rgba(239, 68, 68, 0.6)',  // Red
          'rgba(34, 197, 94, 0.6)',  // Green
          'rgba(139, 92, 246, 0.6)', // Purple
          'rgba(249, 115, 22, 0.6)', // Orange
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
        <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-5">
        <div className="flex">
          <div className="ml-3">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Students Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-blue-600 p-4">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <Users className="mr-2" size={20} />
              Students
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600">{stats.students.length}</span>
            <p className="text-gray-500 mb-4">Total Students</p>
            <Link 
              to="/admin/students" 
              className="mt-auto flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Students
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
        </div>
        
        {/* Pending TCs Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-amber-500 p-4">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FileCheck className="mr-2" size={20} />
              Pending TCs
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-amber-500">
              {stats.transferCertificates.filter(tc => tc.status === 'pending').length}
            </span>
            <p className="text-gray-500 mb-4">Require Attention</p>
            <Link 
              to="/admin/transfer-certificates" 
              className="mt-auto flex items-center text-amber-600 hover:text-amber-800 font-medium"
            >
              Process Transfer Certificates
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
        </div>
        
        {/* Schools Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-cyan-600 p-4">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <Building2 className="mr-2" size={20} />
              Schools
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-cyan-600">{stats.schools.length}</span>
            <p className="text-gray-500 mb-4">Registered Schools</p>
            <Link 
              to="/admin/schools" 
              className="mt-auto flex items-center text-cyan-600 hover:text-cyan-800 font-medium"
            >
              Manage Schools
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transfer Certificate Chart */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 h-96">
          <div className="bg-emerald-600 p-4">
            <h2 className="text-white text-lg font-semibold">
              Transfer Certificate Status
            </h2>
          </div>
          <div className="p-6 h-[calc(100%-64px)]">
            <Doughnut 
              data={transferChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }} 
            />
          </div>
        </div>
        
        {/* Student Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 h-96">
          <div className="bg-gray-700 p-4">
            <h2 className="text-white text-lg font-semibold">
              Student Distribution by School
            </h2>
          </div>
          <div className="p-6 h-[calc(100%-64px)]">
            <Bar 
              data={schoolChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;