-- First check if academic_year column exists, then add it if it doesn't
SET @column_exists = 0;
SELECT COUNT(*) INTO @column_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'schools' 
AND TABLE_NAME = 'academic_records' 
AND COLUMN_NAME = 'academic_year';

SET @add_column_sql = IF(@column_exists = 0, 
                         'ALTER TABLE academic_records ADD COLUMN academic_year VARCHAR(9) DEFAULT "2024-2025"', 
                         'SELECT "Column already exists"');
PREPARE stmt FROM @add_column_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Clear existing records to ensure fresh random data
-- DELETE FROM academic_records;

-- Insert Mathematics records for 10th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '10th' as school_standard,
    'Mathematics' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Mathematics' AND ar.school_standard = '10th'
);

-- Insert Science records for 10th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '10th' as school_standard,
    'Science' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Science' AND ar.school_standard = '10th'
);

-- Insert English records for 10th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '10th' as school_standard,
    'English' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'English' AND ar.school_standard = '10th'
);

-- Insert Computer Science records for 10th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '10th' as school_standard,
    'Computer Science' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Computer Science' AND ar.school_standard = '10th'
);

-- Insert Social Studies records for 10th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '10th' as school_standard,
    'Social Studies' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Social Studies' AND ar.school_standard = '10th'
);

-- 9th Standard Records --

-- Insert Mathematics records for 9th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '9th' as school_standard,
    'Mathematics' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Mathematics' AND ar.school_standard = '9th'
);

-- Insert Science records for 9th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '9th' as school_standard,
    'Science' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Science' AND ar.school_standard = '9th'
);

-- Insert English records for 9th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '9th' as school_standard,
    'English' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'English' AND ar.school_standard = '9th'
);

-- Insert Computer Science records for 9th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '9th' as school_standard,
    'Computer Science' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Computer Science' AND ar.school_standard = '9th'
);

-- Insert Social Studies records for 9th standard with random marks
INSERT INTO academic_records (student_id, school_standard, subject, marks, percentage, grade)
SELECT 
    s.student_id,
    '9th' as school_standard,
    'Social Studies' as subject,
    ROUND(70 + (RAND() * 30), 1) as marks, -- Random marks between 70 and 100
    ROUND(70 + (RAND() * 30), 1) as percentage, -- Same as marks
    CASE 
        WHEN ROUND(70 + (RAND() * 30), 1) >= 90 THEN 'A+'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 80 THEN 'A'
        WHEN ROUND(70 + (RAND() * 30), 1) >= 70 THEN 'B+'
        ELSE 'B'
    END as grade
FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM academic_records ar WHERE ar.student_id = s.student_id AND ar.subject = 'Social Studies' AND ar.school_standard = '9th'
);

-- Update academic years for all records
UPDATE academic_records SET academic_year = '2024-2025' WHERE school_standard = '10th' AND academic_year IS NULL;
UPDATE academic_records SET academic_year = '2023-2024' WHERE school_standard = '9th' AND academic_year IS NULL;