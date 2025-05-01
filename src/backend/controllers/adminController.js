const db = require('../db');

/**
 * Get comprehensive student details including academic records
 */
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(`Fetching comprehensive details for student ID: ${studentId}`);
    
    // Get database connection
    const db = req.app.get('db');
    
    // Fetch student profile
    const [students] = await db.promise().query(
      `SELECT * FROM students WHERE student_id = ?`,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${studentId} not found`
      });
    }

    const student = students[0];
    
    // Fetch academic records with exact field names as in the table
    console.log(`Fetching academic records for student ${studentId}`);
    const [academicRecords] = await db.promise().query(
      `SELECT record_id, student_id, school_standard, subject, marks, percentage, grade, created_at 
       FROM academic_records 
       WHERE student_id = ? 
       ORDER BY school_standard DESC, subject ASC`,
      [studentId]
    );
    
    console.log(`Found ${academicRecords.length} academic records`);
    
    // Keep the original field names to match the database schema
    // This makes debugging easier
    
    // Fetch schemes data if there's a related table
    const [schemes] = await db.promise().query(
      `SELECT * FROM scheme_history WHERE student_id = ?
       ORDER BY start_date DESC`,
      [studentId]
    ).catch(() => [[]]);  // Return empty array if table doesn't exist
    
    // Return comprehensive student details
    return res.status(200).json({
      success: true,
      student: {
        id: student.id,
        student_id: student.student_id,
        name: student.name,
        username: student.username,
        email: student.email,
        dob: student.dob,
        gender: student.gender,
        contact_info: student.contact_info,
        created_at: student.created_at,
        updated_at: student.updated_at
      },
      academicRecords: academicRecords,
      schemes: schemes
    });
    
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student details",
      error: error.message
    });
  }
};

/**
 * Direct endpoint for academic records
 */
exports.getStudentAcademicRecords = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }
    
    console.log(`Direct fetch of academic records for student ${studentId}`);
    
    // Get database connection
    const db = req.app.get('db');
    
    // Try multiple approaches to get the records
    let academicRecords = [];
    
    try {
      // First try with explicit schema
      const [records] = await db.promise().query(
        `SELECT * FROM school.academic_records WHERE student_id = ?`,
        [studentId]
      );
      academicRecords = records;
    } catch (err) {
      console.log("Trying without explicit schema...");
      try {
        // Then try without schema
        const [records] = await db.promise().query(
          `SELECT * FROM academic_records WHERE student_id = ?`,
          [studentId]
        );
        academicRecords = records;
      } catch (err2) {
        console.error("Both queries failed:", err2);
      }
    }
    
    if (academicRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No academic records found for this student"
      });
    }
    
    // Transform to camelCase
    const formattedRecords = academicRecords.map(record => ({
      id: record.id,
      studentId: record.student_id,
      subject: record.subject,
      academicYear: record.academic_year,
      semester: record.semester,
      marks: record.marks,
      percentage: record.percentage,
      grade: record.grade,
      status: record.status
    }));
    
    return res.status(200).json({
      success: true,
      records: formattedRecords
    });
    
  } catch (error) {
    console.error("Error in direct academic records endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching academic records",
      error: error.message
    });
  }
};