-- Insert sample student
INSERT INTO students (name, username, password, dob, current_school_id, contact_info) 
VALUES ('John Doe', 'john.doe', 'password123', '2005-01-15', 1, 'john.doe@example.com');

-- Insert sample academic records
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
VALUES 
(1, '10th', 'Mathematics', 85.5, 85.5, 'A', '2023-2024'),
(1, '10th', 'Science', 92.0, 92.0, 'A+', '2023-2024'),
(1, '10th', 'English', 78.0, 78.0, 'B+', '2023-2024'),
(1, '9th', 'Mathematics', 80.0, 80.0, 'A', '2022-2023'),
(1, '9th', 'Science', 88.5, 88.5, 'A+', '2022-2023'),
(1, '9th', 'English', 75.0, 75.0, 'B+', '2022-2023'); 