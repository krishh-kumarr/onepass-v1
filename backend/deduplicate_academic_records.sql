-- This script removes duplicate academic records, keeping only the most comprehensive set
-- with unique subjects for each student and grade level

-- First create a temporary table to identify duplicates
CREATE TEMPORARY TABLE temp_duplicate_subjects AS
SELECT 
    student_id, 
    school_standard, 
    subject, 
    COUNT(*) as count,
    MAX(record_id) as latest_record_id
FROM academic_records
GROUP BY student_id, school_standard, subject
HAVING COUNT(*) > 1;

-- Delete all but the latest record for each duplicate
DELETE ar FROM academic_records ar
JOIN temp_duplicate_subjects tds ON 
    ar.student_id = tds.student_id AND
    ar.school_standard = tds.school_standard AND
    ar.subject = tds.subject AND
    ar.record_id != tds.latest_record_id;

-- Drop the temporary table
DROP TEMPORARY TABLE IF EXISTS temp_duplicate_subjects;

-- Make sure all records have academic_year set
UPDATE academic_records SET academic_year = '2024-2025' WHERE school_standard = '10th' AND (academic_year IS NULL OR academic_year = '');
UPDATE academic_records SET academic_year = '2023-2024' WHERE school_standard = '9th' AND (academic_year IS NULL OR academic_year = '');