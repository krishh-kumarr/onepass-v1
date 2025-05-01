from flask import Flask, jsonify, request, abort, send_from_directory
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_connection():
    """ Create a database connection to the MySQL database """
    try:
        connection = mysql.connector.connect(
            host="localhost",  # or "127.0.0.1"
            user="root",
            password="Gmps@12345",
            database="school"
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
        cursor.execute(
            "SELECT * FROM documents WHERE student_id = %s ORDER BY upload_date DESC",
            (student_id,)
        )

        documents = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify({"documents": documents})

    except Error as e:
        return jsonify({"message": str(e)}), 500


# Document upload endpoint
@app.route('/api/students/<int:student_id>/documents/upload', methods=['POST'])
def upload_document(student_id):
    connection = create_connection()
    if not connection:
        return jsonify({"message": "Database connection error"}), 500

    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        document_type = request.form.get('documentType')
        now = datetime.datetime.now()
        upload_date = now.strftime("%Y-%m-%d")

        try:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO documents (student_id, document_type, file_name, file_path, upload_date) VALUES (%s, %s, %s, %s, %s)",
                (student_id, document_type, filename, file_path, upload_date)
            )

            connection.commit()
            document_id = cursor.lastrowid
            cursor.close()
            connection.close()

            return jsonify({
                "message": "Document uploaded successfully",
                "document": {
                    "document_id": document_id,
                    "student_id": student_id,
                    "document_type": document_type,
                    "file_name": filename,
                    "file_path": file_path,
                    "upload_date": upload_date
                }
            })

        except Error as e:
            return jsonify({"message": str(e)}), 500
    else:
        return jsonify({"message": "File type not allowed"}), 400


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


if __name__ == '__main__':
    app.run(debug=True)
