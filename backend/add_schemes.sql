-- Set foreign key checks to 0 temporarily to allow clean removal
SET FOREIGN_KEY_CHECKS = 0;

-- Delete existing scheme history first
DELETE FROM scheme_history;

-- Then delete schemes
DELETE FROM schemes;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert sample schemes with explicit IDs to ensure consistency
INSERT INTO schemes (scheme_id, name, description) VALUES 
(1, 'PM Poshan (Mid-Day Meal)', 'Provides free lunch on working days to children in primary and upper primary classes'),
(2, 'Samagra Shiksha Abhiyan', 'Comprehensive program aimed at improving school effectiveness and learning outcomes'),
(3, 'PM SHRI Schools', 'Providing quality education in an equitable, inclusive and joyful school environment'),
(4, 'Digital Infrastructure for Knowledge Sharing (DIKSHA)', 'Digital platform for teachers to access resources and training'),
(5, 'National Means-cum-Merit Scholarship (NMMS)', 'Financial assistance to meritorious students from economically weaker sections'),
(6, 'National Talent Search Scheme (NTSS)', 'Identifies talented students and provides scholarships for entire academic career'),
(7, 'Sarva Shiksha Abhiyan (SSA)', 'Program aimed at universalization of elementary education'),
(8, 'Rashtriya Madhyamik Shiksha Abhiyan (RMSA)', 'Program to enhance access to secondary education'),
(9, 'Operation Digital Board', 'Initiative to provide digital smart boards in all classrooms'),
(10, 'School Health Program', 'Regular health check-ups and health education for children'),
(11, 'Vidyanjali', 'School volunteer program connecting schools with contributors from the community'),
(12, 'Padhna Likhna Abhiyan', 'Adult education program focusing on basic literacy and numeracy'),
(13, 'Beti Bachao Beti Padhao (BBBP)', 'Campaign to save and educate girl children');

-- Add schemes for each student
-- First scheme: PM Poshan (Mid-Day Meal)
INSERT INTO scheme_history (student_id, scheme_id, start_date, end_date, benefits, details)
SELECT 
    s.student_id,
    1, 
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(365 + RAND() * 730) DAY),
    NULL,
    'Free nutritious lunch on all school days',
    'Student receives a balanced meal with proper nutrition as part of the national program to combat hunger and promote education'
FROM 
    students s;

-- Second scheme: PM SHRI Schools
INSERT INTO scheme_history (student_id, scheme_id, start_date, end_date, benefits, details)
SELECT 
    s.student_id,
    3,
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(365 + RAND() * 730) DAY),
    NULL,
    'Quality education in modern infrastructure',
    'Student is enrolled in the PM SHRI Schools program which focuses on modern teaching methodologies and improved school environment'
FROM 
    students s;

-- Third scheme: National Means-cum-Merit Scholarship
INSERT INTO scheme_history (student_id, scheme_id, start_date, end_date, benefits, details)
SELECT 
    s.student_id,
    5,
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(730 + RAND() * 365) DAY),
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 365) DAY),
    'Rs. 12,000 per annum scholarship',
    'Student received financial assistance based on both merit and economic need over the specified period'
FROM 
    students s;

-- Fourth scheme: Random from 7-9 (SSA, RMSA, or Digital Board)
INSERT INTO scheme_history (student_id, scheme_id, start_date, end_date, benefits, details)
SELECT 
    s.student_id,
    7 + FLOOR(RAND() * 3),
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(180 + RAND() * 365) DAY),
    NULL,
    'Infrastructure improvement and educational resources',
    'Student benefits from improved school facilities and quality educational materials through this government initiative'
FROM 
    students s;

-- Fifth scheme for ~50% of students: Random from 10-13
INSERT INTO scheme_history (student_id, scheme_id, start_date, end_date, benefits, details)
SELECT 
    s.student_id,
    10 + FLOOR(RAND() * 4),
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(90 + RAND() * 180) DAY),
    DATE_SUB(CURRENT_DATE, INTERVAL FLOOR(RAND() * 60) DAY),
    'Additional educational support and awareness',
    'Student participated in a special government initiative providing additional educational opportunities and community integration'
FROM 
    students s
WHERE 
    MOD(student_id, 2) = 0; -- For approximately half of the students (those with even IDs)