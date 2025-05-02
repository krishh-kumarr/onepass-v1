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
    academic_year VARCHAR(9) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Clear all existing academic records
TRUNCATE TABLE academic_records;

-- Insert academic records for 3rd, 4th, and 5th standards with 5 subjects each
-- Function to generate random marks between 60 and 100
DELIMITER //
CREATE FUNCTION IF NOT EXISTS RandomMark() 
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    RETURN ROUND(60 + (RAND() * 40), 1);
END //
DELIMITER ;

-- Function to determine grade based on marks
DELIMITER //
CREATE FUNCTION IF NOT EXISTS GetGrade(marks DECIMAL(5,2)) 
RETURNS VARCHAR(2)
DETERMINISTIC
BEGIN
    DECLARE grade VARCHAR(2);
    
    IF marks >= 90 THEN
        SET grade = 'A+';
    ELSEIF marks >= 80 THEN
        SET grade = 'A';
    ELSEIF marks >= 70 THEN
        SET grade = 'B+';
    ELSEIF marks >= 60 THEN
        SET grade = 'B';
    ELSE
        SET grade = 'C';
    END IF;
    
    RETURN grade;
END //
DELIMITER ;

-- Variables to hold the random values
SET @english_marks = 0;
SET @hindi_marks = 0;
SET @maths_marks = 0;
SET @evs_marks = 0;
SET @computer_marks = 0;

-- Insert records for 3rd standard
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '3rd' as school_standard,
    'English' as subject,
    @english_marks := RandomMark() as marks,
    @english_marks as percentage,
    GetGrade(@english_marks) as grade,
    '2020-2021' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '3rd' as school_standard,
    'Hindi' as subject,
    @hindi_marks := RandomMark() as marks,
    @hindi_marks as percentage,
    GetGrade(@hindi_marks) as grade,
    '2020-2021' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '3rd' as school_standard,
    'Maths' as subject,
    @maths_marks := RandomMark() as marks,
    @maths_marks as percentage,
    GetGrade(@maths_marks) as grade,
    '2020-2021' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '3rd' as school_standard,
    'EVS' as subject,
    @evs_marks := RandomMark() as marks,
    @evs_marks as percentage,
    GetGrade(@evs_marks) as grade,
    '2020-2021' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '3rd' as school_standard,
    'Computer' as subject,
    @computer_marks := RandomMark() as marks,
    @computer_marks as percentage,
    GetGrade(@computer_marks) as grade,
    '2020-2021' as academic_year
FROM students s;

-- Insert records for 4th standard
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '4th' as school_standard,
    'English' as subject,
    @english_marks := RandomMark() as marks,
    @english_marks as percentage,
    GetGrade(@english_marks) as grade,
    '2021-2022' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '4th' as school_standard,
    'Hindi' as subject,
    @hindi_marks := RandomMark() as marks,
    @hindi_marks as percentage,
    GetGrade(@hindi_marks) as grade,
    '2021-2022' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '4th' as school_standard,
    'Maths' as subject,
    @maths_marks := RandomMark() as marks,
    @maths_marks as percentage,
    GetGrade(@maths_marks) as grade,
    '2021-2022' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '4th' as school_standard,
    'EVS' as subject,
    @evs_marks := RandomMark() as marks,
    @evs_marks as percentage,
    GetGrade(@evs_marks) as grade,
    '2021-2022' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '4th' as school_standard,
    'Computer' as subject,
    @computer_marks := RandomMark() as marks,
    @computer_marks as percentage,
    GetGrade(@computer_marks) as grade,
    '2021-2022' as academic_year
FROM students s;

-- Insert records for 5th standard
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '5th' as school_standard,
    'English' as subject,
    @english_marks := RandomMark() as marks,
    @english_marks as percentage,
    GetGrade(@english_marks) as grade,
    '2022-2023' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '5th' as school_standard,
    'Hindi' as subject,
    @hindi_marks := RandomMark() as marks,
    @hindi_marks as percentage,
    GetGrade(@hindi_marks) as grade,
    '2022-2023' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '5th' as school_standard,
    'Maths' as subject,
    @maths_marks := RandomMark() as marks,
    @maths_marks as percentage,
    GetGrade(@maths_marks) as grade,
    '2022-2023' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '5th' as school_standard,
    'EVS' as subject,
    @evs_marks := RandomMark() as marks,
    @evs_marks as percentage,
    GetGrade(@evs_marks) as grade,
    '2022-2023' as academic_year
FROM students s;

INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade, academic_year)
SELECT 
    s.student_id,
    '5th' as school_standard,
    'Computer' as subject,
    @computer_marks := RandomMark() as marks,
    @computer_marks as percentage,
    GetGrade(@computer_marks) as grade,
    '2022-2023' as academic_year
FROM students s;

-- Drop the temporary functions
DROP FUNCTION IF EXISTS RandomMark;
DROP FUNCTION IF EXISTS GetGrade;