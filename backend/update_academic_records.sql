-- Drop the existing academic_records table
DROP TABLE IF EXISTS academic_records;

-- Create the new academic_records table with the correct structure
CREATE TABLE academic_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    school_standard VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    grade VARCHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Insert sample data for student_id 1 (Grade 10)
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade) VALUES
(1, 'Grade 10', 'Mathematics', 85.50, 85.50, 'A'),
(1, 'Grade 10', 'Science', 78.00, 78.00, 'B+'),
(1, 'Grade 10', 'English', 92.00, 92.00, 'A+'),
(1, 'Grade 10', 'History', 80.00, 80.00, 'B+'),
(1, 'Grade 10', 'Geography', 88.00, 88.00, 'A');

-- Insert sample data for student_id 2 (Grade 10)
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade) VALUES
(2, 'Grade 10', 'Mathematics', 72.50, 72.50, 'B'),
(2, 'Grade 10', 'Science', 68.00, 68.00, 'C+'),
(2, 'Grade 10', 'English', 82.00, 82.00, 'B+'),
(2, 'Grade 10', 'History', 75.00, 75.00, 'B'),
(2, 'Grade 10', 'Geography', 79.00, 79.00, 'B+');

-- Insert sample data for student_id 3 (Grade 9)
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade) VALUES
(3, 'Grade 9', 'Mathematics', 84.00, 84.00, 'A'),
(3, 'Grade 9', 'Science', 76.50, 76.50, 'B+'),
(3, 'Grade 9', 'English', 88.00, 88.00, 'A'),
(3, 'Grade 9', 'History', 79.00, 79.00, 'B+'),
(3, 'Grade 9', 'Geography', 82.00, 82.00, 'A'); 