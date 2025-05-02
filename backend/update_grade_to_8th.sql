-- Change only "Grade 10" to "8th" in academic records (keep "10th" as is)
UPDATE academic_records 
SET school_standard = '8th'
WHERE school_standard = 'Grade 10';

-- Update the academic year for newly changed 8th grade records
UPDATE academic_records 
SET academic_year = '2022-2023' 
WHERE school_standard = '8th' AND (academic_year IS NULL OR academic_year = '');