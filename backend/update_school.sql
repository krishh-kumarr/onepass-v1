-- First, check if PM SHRI Mahatma Gandhi Government School exists
SELECT @school_id := school_id FROM schools WHERE name = 'PM SHRI Mahatma Gandhi Government School' LIMIT 1;

-- If the school doesn't exist, create it
INSERT INTO schools (name, address, contact_info)
SELECT 'PM SHRI Mahatma Gandhi Government School', 'Gandhi Road, City Center', 'pmshri@example.com'
WHERE @school_id IS NULL;

-- Get the ID of the school (either existing or newly created)
SELECT @school_id := school_id FROM schools WHERE name = 'PM SHRI Mahatma Gandhi Government School' LIMIT 1;

-- Update all students to use this school
UPDATE students SET current_school_id = @school_id;

-- Delete all other schools (optional, only if you want to remove all other schools)
-- DELETE FROM schools WHERE school_id != @school_id;