-- Drop existing table if it exists
DROP TABLE IF EXISTS transfer_certificates;

-- Create transfer_certificates table
CREATE TABLE transfer_certificates (
    tc_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    application_date DATE NOT NULL,
    destination_school VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    transfer_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comments TEXT,
    processed_by VARCHAR(100),  -- Changed to VARCHAR to store admin name instead of ID
    processed_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Insert sample data
INSERT INTO transfer_certificates (student_id, application_date, destination_school, reason, transfer_date, status, comments, processed_by) VALUES
(1, '2024-01-15', 'ABC High School', 'Family relocation', '2024-03-01', 'approved', 'Application approved after verification', 'Admin User'),
(2, '2024-02-01', 'XYZ Public School', 'Change of residence', '2024-04-01', 'pending', NULL, NULL),
(3, '2024-01-20', 'Global Academy', 'Better educational opportunities', '2024-03-15', 'rejected', 'Insufficient documentation', 'Admin User'); 