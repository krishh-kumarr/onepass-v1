const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ...existing code...

// Comprehensive student details route
router.get('/students/:studentId/comprehensive', adminController.getStudentDetails);

// Direct endpoint for academic records
router.get('/academic-records', adminController.getStudentAcademicRecords);

// ...existing code...

module.exports = router;