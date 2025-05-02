from flask import Flask, jsonify, request, abort, send_from_directory
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import datetime
import os
import sys
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder and allowed extensions
# Use absolute path for the upload folder to ensure consistency
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
        print(f"Created upload directory at: {UPLOAD_FOLDER}")
    except Exception as e:
        print(f"Failed to create upload directory: {str(e)}")
        sys.exit(1)  # Exit if crucial directory cannot be created

# Check if upload directory is writable
if not os.access(UPLOAD_FOLDER, os.W_OK):
    print(f"WARNING: Upload directory {UPLOAD_FOLDER} is not writable")

print(f"Upload directory set to: {UPLOAD_FOLDER}")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_connection():
    """ Create a database connection to the MySQL database """
    try:
        connection = mysql.connector.connect(
            host="localhost",  # or "127.0.0.1"
            user="root",
            password="krish1410",
            database="schools"
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)
    return None


@app.route('/')
def index():
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        cursor.close()
        connection.close()
        tables_list = [table[0] for table in tables]
        return jsonify({"tables": tables_list})
    else:
        return jsonify({"message": "Failed to connect to MySQL database"}), 500


@app.route('/tables/<table_name>', methods=['GET'])
def get_table_contents(table_name):
    connection = create_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            cursor.close()
            connection.close()
            return jsonify({table_name: rows})
        except Error as e:
            return jsonify({"message": str(e)}), 500
    else:
        return jsonify({"message": "Failed to connect to MySQL database"}), 500


# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user_type = data.get('userType')

    if not all([username, password, user_type]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        cursor = connection.cursor(dictionary=True)

        if user_type == 'student':
            cursor.execute(
                "SELECT * FROM students WHERE username = %s AND password = %s",
                (username, password)
            )
        elif user_type == 'admin':
            cursor.execute(
                "SELECT * FROM admins WHERE username = %s AND password = %s",
                (username, password)
            )
        else:
            return jsonify({"message": "Invalid user type"}), 400

        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            # In a production app, we would use proper JWT tokens here
            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user.get('student_id') if user_type == 'student' else user.get('admin_id'),
                    "name": user.get('name'),
                    "username": user.get('username'),
                    "userType": user_type
                },
                "token": "fake-jwt-token-" + user_type
            })
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Student profile endpoint
@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)

        # Join with schools table to get school name
        cursor.execute(
            """
            SELECT s.*, sch.name as school_name 
            FROM students s 
            LEFT JOIN schools sch ON s.current_school_id = sch.school_id 
            WHERE s.student_id = %s
            """,
            (student_id,)
        )

        profile = cursor.fetchone()
        cursor.close()
        connection.close()

        if profile:
            # Remove password from response
            if 'password' in profile:
                del profile['password']

            return jsonify({"profile": profile})
        else:
            return jsonify({"message": "Student not found"}), 404

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Academic records endpoint
@app.route('/api/students/<int:student_id>/academic-records', methods=['GET'])
def get_academic_records(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT record_id, student_id, school_standard, subject, marks, percentage, grade 
            FROM academic_records 
            WHERE student_id = %s 
            ORDER BY school_standard DESC, subject ASC
            """,
            (student_id,)
        )

        records = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"academicRecords": records})

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Documents endpoint
@app.route('/api/students/<int:student_id>/documents', methods=['GET'])
def get_documents(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        # Modified query to only select columns that exist in the table
        cursor.execute(
            "SELECT document_id, document_type, file_name, upload_date FROM documents WHERE student_id = %s ORDER BY upload_date DESC",
            (student_id,)
        )

        documents = cursor.fetchall()
        cursor.close()
        connection.close()

        print(f"Found {len(documents)} documents for student {student_id}")

        if not documents:
            return jsonify({"documents": []}), 200  # Return empty array instead of 404

        # Add file_url for frontend access
        for document in documents:
            # Construct URL based on file_name only
            document['file_url'] = request.host_url.rstrip('/') + '/uploads/' + document['file_name']

        print(f"Returning documents with URLs: {documents}")
        return jsonify({"documents": documents})

    except Error as e:
        print(f"Error fetching documents: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Document upload endpoint
@app.route('/api/students/<int:student_id>/documents/upload', methods=['POST'])
def upload_document(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    print(f"Processing document upload for student {student_id}")
    
    # Debug request information
    print(f"Request files: {request.files}")
    print(f"Request form: {request.form}")
    
    if 'file' not in request.files:
        print("No file part in the request")
        return jsonify({"message": "No file part in request"}), 400

    file = request.files['file']
    
    if file.filename == '':
        print("Empty filename submitted")
        return jsonify({"message": "No selected file"}), 400
        
    if not file:
        print("File object is invalid")
        return jsonify({"message": "Invalid file"}), 400

    print(f"Received file: {file.filename}, type: {file.content_type}")
    
    if file and allowed_file(file.filename):
        try:
            # Create a more unique filename to avoid overwriting
            timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            original_filename = secure_filename(file.filename)
            filename = f"{timestamp}_{original_filename}"
            
            # Full path for storing the file
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            print(f"Saving file to: {file_path}")
            file.save(file_path)
            
            document_type = request.form.get('documentType')
            now = datetime.datetime.now()
            upload_date = now.strftime("%Y-%m-%d")

            # Check if the documents table has a file_path column
            cursor = connection.cursor()
            try:
                # Try inserting with file_path
                cursor.execute(
                    "INSERT INTO documents (student_id, document_type, file_name, file_path, upload_date) VALUES (%s, %s, %s, %s, %s)",
                    (student_id, document_type, filename, f"uploads/{filename}", upload_date)
                )
            except Error as column_error:
                # If file_path column doesn't exist, try without it
                if "Unknown column 'file_path'" in str(column_error):
                    print("file_path column not found, trying without it")
                    cursor.execute(
                        "INSERT INTO documents (student_id, document_type, file_name, upload_date) VALUES (%s, %s, %s, %s)",
                        (student_id, document_type, filename, upload_date)
                    )
                else:
                    # Re-raise if it's a different error
                    raise column_error

            connection.commit()
            document_id = cursor.lastrowid
            cursor.close()
            connection.close()

            print(f"Document uploaded successfully, ID: {document_id}")
            
            return jsonify({
                "message": "Document uploaded successfully",
                "document": {
                    "document_id": document_id,
                    "student_id": student_id,
                    "document_type": document_type,
                    "file_name": filename,
                    "upload_date": upload_date
                }
            })

        except Exception as e:
            print(f"Error during file upload: {str(e)}")
            return jsonify({"message": f"Upload failed: {str(e)}"}), 500
    else:
        allowed_extensions = ', '.join(ALLOWED_EXTENSIONS)
        print(f"File type not allowed. Allowed types: {allowed_extensions}")
        return jsonify({
            "message": f"File type not allowed. Allowed types: {allowed_extensions}"
        }), 400


# Document deletion endpoint
@app.route('/api/students/<int:student_id>/documents/<int:document_id>', methods=['DELETE'])
def delete_document(student_id, document_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    print(f"Processing document deletion for student {student_id}, document {document_id}")
    
    try:
        # First, get the document to retrieve the file name
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM documents WHERE document_id = %s AND student_id = %s",
            (document_id, student_id)
        )
        document = cursor.fetchone()
        
        if not document:
            return jsonify({"message": "Document not found or does not belong to this student"}), 404
        
        # Delete the document record from the database
        cursor.execute(
            "DELETE FROM documents WHERE document_id = %s AND student_id = %s",
            (document_id, student_id)
        )
        connection.commit()
        cursor.close()
        
        # Try to delete the file from the filesystem if it exists
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], document['file_name'])
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Deleted file: {file_path}")
            else:
                print(f"File not found: {file_path}")
        except Exception as file_error:
            # Log error but don't fail the request - database record is already deleted
            print(f"Error deleting file: {str(file_error)}")
        
        print(f"Document {document_id} deleted successfully")
        return jsonify({"message": "Document deleted successfully"})

    except Error as e:
        print(f"Database error deleting document: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Serve static files (uploaded documents)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Transfer certificate endpoints
@app.route('/api/students/<int:student_id>/transfer-certificate', methods=['POST'])
def apply_transfer_certificate(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    data = request.get_json()
    destination_school = data.get('destinationSchool')
    reason = data.get('reason')
    transfer_date = data.get('transferDate')

    if not all([destination_school, reason, transfer_date]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        cursor = connection.cursor()
        now = datetime.datetime.now()
        application_date = now.strftime("%Y-%m-%d")

        cursor.execute(
            """
            INSERT INTO transfer_certificates 
            (student_id, application_date, destination_school, reason, transfer_date, status) 
            VALUES (%s, %s, %s, %s, %s, 'pending')
            """,
            (student_id, application_date, destination_school, reason, transfer_date)
        )

        connection.commit()
        tc_id = cursor.lastrowid
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Transfer certificate application submitted successfully",
            "transferCertificate": {
                "tc_id": tc_id,
                "student_id": student_id,
                "application_date": application_date,
                "destination_school": destination_school,
                "reason": reason,
                "transfer_date": transfer_date,
                "status": "pending"
            }
        })

    except Error as e:
        return jsonify({"message": str(e)}), 500


@app.route('/api/students/<int:student_id>/transfer-certificate', methods=['GET'])
def get_transfer_certificate(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT tc.*, s.name as student_name 
            FROM transfer_certificates tc
            JOIN students s ON tc.student_id = s.student_id
            WHERE tc.student_id = %s
            ORDER BY application_date DESC
            """,
            (student_id,)
        )

        certificates = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"transferCertificates": certificates})

    except Error as e:
        return jsonify({"message": str(e)}), 500


@app.route('/api/students/<int:student_id>/transfer-certificate/<int:tc_id>', methods=['DELETE'])
def delete_transfer_certificate(student_id, tc_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    print(f"Processing transfer certificate deletion for student {student_id}, certificate {tc_id}")
    
    try:
        # First, check if the certificate exists and belongs to the student
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM transfer_certificates WHERE tc_id = %s AND student_id = %s",
            (tc_id, student_id)
        )
        certificate = cursor.fetchone()
        
        if not certificate:
            return jsonify({"message": "Transfer certificate not found or does not belong to this student"}), 404
        
        # Only allow deletion of pending applications
        if certificate['status'] != 'pending':
            return jsonify({"message": "Only pending applications can be deleted"}), 400
        
        # Delete the certificate record from the database
        cursor.execute(
            "DELETE FROM transfer_certificates WHERE tc_id = %s AND student_id = %s",
            (tc_id, student_id)
        )
        connection.commit()
        cursor.close()
        connection.close()
        
        print(f"Transfer certificate {tc_id} deleted successfully")
        return jsonify({"message": "Transfer certificate deleted successfully"})

    except Error as e:
        print(f"Database error deleting transfer certificate: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Scheme history endpoint
@app.route('/api/students/<int:student_id>/schemes', methods=['GET'])
def get_scheme_history(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT sh.*, s.name as scheme_name
            FROM scheme_history sh
            JOIN schemes s ON sh.scheme_id = s.scheme_id
            WHERE sh.student_id = %s
            ORDER BY start_date DESC
            """,
            (student_id,)
        )

        schemes = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"schemes": schemes})

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Admin endpoints for students list
@app.route('/api/admin/students', methods=['GET'])
def get_all_students():
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT s.student_id, s.name, s.dob, s.current_school_id, s.contact_info, sch.name as school_name
            FROM students s
            LEFT JOIN schools sch ON s.current_school_id = sch.school_id
            ORDER BY s.student_id
            """
        )

        students = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"students": students})

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Admin endpoint to get a single student's details
@app.route('/api/admin/students/<int:student_id>', methods=['GET'])
def get_student_details(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500
        
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT s.*, sch.name as school_name 
            FROM students s 
            LEFT JOIN schools sch ON s.current_school_id = sch.school_id 
            WHERE s.student_id = %s
            """, 
            (student_id,)
        )
        student = cursor.fetchone()
        cursor.close()
        
        if not student:
            return jsonify({"message": "Student not found"}), 404
            
        # Remove password from response for security
        if 'password' in student:
            del student['password']
            
        return jsonify({"student": student})
        
    except Error as e:
        print(f"Error getting student details: {str(e)}")
        return jsonify({"message": str(e)}), 500

# Admin endpoint to update student information
@app.route('/api/admin/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500
        
    data = request.get_json()
    name = data.get('name')
    dob = data.get('dob')
    contact_info = data.get('contact_info')
    
    if not name:
        return jsonify({"message": "Name is required"}), 400
        
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE students 
            SET name = %s, dob = %s, contact_info = %s
            WHERE student_id = %s
            """, 
            (name, dob, contact_info, student_id)
        )
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            "message": "Student updated successfully",
            "student": {
                "student_id": student_id,
                "name": name,
                "dob": dob,
                "contact_info": contact_info,
                "school_name": "PM SHRI Mahatma Gandhi Government School" # As per policy
            }
        })
        
    except Error as e:
        print(f"Error updating student: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Admin endpoints for transfer certificate approval
@app.route('/api/admin/transfer-certificates', methods=['GET'])
def get_transfer_certificates():
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT tc.*, s.name as student_name 
            FROM transfer_certificates tc
            JOIN students s ON tc.student_id = s.student_id
            ORDER BY application_date DESC
            """
        )

        certificates = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"transferCertificates": certificates})

    except Error as e:
        return jsonify({"message": str(e)}), 500


@app.route('/api/admin/transfer-certificates/<int:tc_id>', methods=['PATCH'])
def update_transfer_certificate(tc_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    data = request.get_json()
    status = data.get('status')
    comments = data.get('comments')
    processed_by = data.get('processed_by')

    if not status:
        return jsonify({"message": "Status is required"}), 400

    try:
        cursor = connection.cursor()
        now = datetime.datetime.now()
        processed_date = now.strftime("%Y-%m-%d")

        cursor.execute(
            """
            UPDATE transfer_certificates 
            SET status = %s, comments = %s, processed_by = %s, processed_date = %s
            WHERE tc_id = %s
            """,
            (status, comments, processed_by, processed_date, tc_id)
        )

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Transfer certificate updated successfully",
            "transferCertificate": {
                "tc_id": tc_id,
                "status": status,
                "comments": comments,
                "processed_by": processed_by,
                "processed_date": processed_date
            }
        })

    except Error as e:
        return jsonify({"message": str(e)}), 500


@app.route('/api/admin/transfer-certificates/<int:tc_id>', methods=['DELETE'])
def admin_delete_transfer_certificate(tc_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    print(f"Admin deleting transfer certificate with ID: {tc_id}")
    
    try:
        # First, check if the certificate exists
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM transfer_certificates WHERE tc_id = %s",
            (tc_id,)
        )
        certificate = cursor.fetchone()
        
        if not certificate:
            return jsonify({"message": "Transfer certificate not found"}), 404
        
        # Delete the certificate record from the database
        cursor.execute(
            "DELETE FROM transfer_certificates WHERE tc_id = %s",
            (tc_id,)
        )
        connection.commit()
        cursor.close()
        connection.close()
        
        print(f"Transfer certificate {tc_id} deleted successfully by admin")
        return jsonify({"message": "Transfer certificate deleted successfully"})

    except Error as e:
        print(f"Database error deleting transfer certificate: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Schools endpoint
@app.route('/api/admin/schools', methods=['GET'])
def get_all_schools():
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM schools ORDER BY name")

        schools = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"schools": schools})

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Admin endpoint to get a single student's comprehensive details
@app.route('/api/admin/students/<int:student_id>/comprehensive', methods=['GET'])
def get_student_comprehensive_details(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500
        
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get student profile
        cursor.execute(
            """
            SELECT s.*, sch.name as school_name 
            FROM students s 
            LEFT JOIN schools sch ON s.current_school_id = sch.school_id 
            WHERE s.student_id = %s
            """, 
            (student_id,)
        )
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"message": "Student not found"}), 404
            
        # Remove password from response for security
        if 'password' in student:
            del student['password']
        
        # Get academic records for the student
        academic_records = []
        try:
            cursor.execute(
                """
                SELECT record_id, student_id, school_standard, subject, marks, percentage, grade, 
                       COALESCE(academic_year, '2024-2025') as academic_year
                FROM academic_records
                WHERE student_id = %s
                ORDER BY school_standard DESC, subject ASC
                """,
                (student_id,)
            )
            academic_records = cursor.fetchall()
            print(f"Found {len(academic_records)} academic records for student {student_id}")
        except Error as e:
            print(f"Error fetching academic records: {str(e)}")
            # Continue with empty academic records instead of failing the whole request
        
        # Get schemes for the student
        schemes = []
        try:
            cursor.execute(
                """
                SELECT sh.history_id, sh.student_id, sh.scheme_id, sh.start_date, sh.end_date, 
                       sh.benefits, sh.details, s.name, s.description
                FROM scheme_history sh
                JOIN schemes s ON sh.scheme_id = s.scheme_id
                WHERE sh.student_id = %s
                ORDER BY sh.start_date DESC
                """,
                (student_id,)
            )
            schemes = cursor.fetchall()
            print(f"Found {len(schemes)} schemes for student {student_id}")
        except Error as e:
            print(f"Error fetching schemes: {str(e)}")
            # Continue with empty schemes instead of failing the whole request
        
        cursor.close()
        connection.close()
        
        # Return the data, ensuring each item is serializable
        result = {
            "student": {k: (v.isoformat() if isinstance(v, datetime.date) else v) 
                       for k, v in student.items()},
            "academicRecords": [{k: (v.isoformat() if isinstance(v, datetime.date) else v) 
                                for k, v in record.items()} 
                               for record in academic_records],
            "schemes": [{k: (v.isoformat() if isinstance(v, datetime.date) else v) 
                        for k, v in scheme.items()} 
                       for scheme in schemes]
        }
        
        return jsonify(result)
        
    except Error as e:
        print(f"Error getting comprehensive student details: {str(e)}")
        return jsonify({"message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
