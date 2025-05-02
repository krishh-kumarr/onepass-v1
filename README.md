# 🎓 OnePass

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.3.x-000000.svg?logo=flask&logoColor=white)
<p align="center">
## 👥 Contributors & Collaborators

<p align="center">
<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/krishh-kumarr">
        <img src="https://github.com/krishh-kumarr.png" width="100px;" alt="Krish Kumar"/><br />
        <sub><b>Krish Kumar</b></sub>
      </a><br />
      <sub>Lead Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/GlitchZap">
        <img src="https://github.com/GlitchZap.png" width="100px;" alt="Aayush Kumar"/><br />
        <sub><b>Aayush Kumar</b></sub>
      </a><br />
      <sub>Backend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/zydnet">
        <img src="https://github.com/zydnet.png" width="100px;" alt="Devanshi Agrawal"/><br />
        <sub><b>Devanshi Agrawal</b></sub>
      </a><br />
    </td>
  </tr>
</table>
</p>

Special thanks to all our beta testers and the educational institutions that provided valuable feedback during development.

---
<p align="center">
  Made with ❤️ by the OnePass team
</p>

<p align="center">
  <img src="public/logo192.png" alt="PM SHRI Logo" width="400">
</p>

<p align="center">
  <b>A unified education management platform for students and administrators</b>
</p>

## ✨ Overview

OnePass is a comprehensive education management system that provides a seamless interface for both students and administrators. It brings together academic records, document management, and administrative functions in a single, elegant platform.

### For Students
- Access and view academic records across all standards
- Store and manage important educational documents
- Apply for transfer certificates with ease
- Track scholarships and benefits

### For Administrators
- Comprehensive student management
- School database administration
- Transfer certificate approval workflow
- Academic record management

## 🚀 Technologies

### Frontend
- **React.js** - Modern UI component framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - For application routing
- **Formik** - Form handling with validation
- **Styled Components** - Styled components for custom UI
- **Lucide React** - Modern SVG icon library

### Backend
- **Flask** - Python web framework
- **MySQL** - Database management
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - WSGI utility library for file uploads

## Database setup 
MySQL Database Setup

This project uses a MySQL database named `onepass_db`. Follow the steps below to set it up using the provided `onepass_db.sql` file.

### Prerequisites

- MySQL installed on your machine.
- Access to a MySQL user account (default is `root`).

### Steps to Set Up the Database

#### 1. Open your terminal

#### 2. Login to MySQL

mysql -u root -p
Enter your MySQL password when prompted.

#### 3. Create the database

CREATE DATABASE onepass_db;
exit;

#### 4. Import the .sql file into the database

If the .sql file is on your Desktop:
mysql -u root -p onepass_db < ~/Desktop/onepass_db.sql

If the .sql file is in the project folder:
mysql -u root -p onepass_db < ./onepass_db.sql

#### Done!

The onepass_db database is now ready to use.

You can access it with:
mysql -u root -p onepass_db

Then run:
SHOW TABLES;

## 📸 Screenshots

<table>
  <tr>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.00.38.jpeg" alt="OnePass Login" /></td>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.02.30.jpeg" alt="Student Dashboard" /></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.02.46.jpeg" alt="Academic Records" /></td>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.03.10.jpeg" alt="Document Management" /></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.03.29.jpeg" alt="Student Details" /></td>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.03.39.jpeg" alt="Admin Dashboard" /></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.03.50.jpeg" alt="Transfer Certificates" /></td>
    <td><img src="public/screenshots/WhatsApp Image 2025-05-02 at 15.04.02.jpeg" alt="Student Management" /></td>
  </tr>
</table>

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MySQL Server

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/krishh-kumarr/onepass-v1.git
cd onepass-v1

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
mysql -u root -p < create_tables.sql
mysql -u root -p < insert_sample_data.sql

# Start the backend server
python main.py
```

## 🔒 Authentication

OnePass provides separate authentication flows for students and administrators:

- **Students** - Login with student credentials to access their personal academic dashboard
- **Administrators** - Login with admin credentials to access the comprehensive management interface

### Demo Credentials

#### Student Account
- **Username**: student1
- **Password**: password
- **Type**: Student

#### Admin Account
- **Username**: admin1
- **Password**: password
- **Type**: Administrator

## 🌟 Features

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Updates** - Instant feedback on all actions
- **Elegant UI** - Modern interface with smooth transitions and gradients
- **Document Management** - Upload, view, and manage educational documents
- **User Authentication** - Secure login and session management
- **Academic Records** - Comprehensive view of student performance
- **Transfer Certificates** - Apply for and manage transfer certificates

## 🔧 API Endpoints

### Authentication API
- `POST /api/auth/login` - Authenticate user (student or admin)

### Student API
- `GET /api/students/:id` - Get student profile
- `GET /api/students/:id/academic-records` - Get academic records
- `GET /api/students/:id/documents` - Get student documents
- `POST /api/students/:id/documents/upload` - Upload a document
- `DELETE /api/students/:id/documents/:id` - Delete a document
- `GET /api/students/:id/transfer-certificate` - Get transfer certificates
- `POST /api/students/:id/transfer-certificate` - Apply for a transfer certificate
- `DELETE /api/students/:id/transfer-certificate/:id` - Delete a transfer certificate application
- `GET /api/students/:id/schemes` - Get scholarship schemes

### Admin API
- `GET /api/admin/students` - Get all students
- `GET /api/admin/students/:id` - Get specific student details
- `PUT /api/admin/students/:id` - Update student information
- `GET /api/admin/students/:id/comprehensive` - Get comprehensive student details
- `GET /api/admin/transfer-certificates` - Get all transfer certificate requests
- `PATCH /api/admin/transfer-certificates/:id` - Update transfer certificate status
- `DELETE /api/admin/transfer-certificates/:id` - Delete a transfer certificate
- `GET /api/admin/schools` - Get all schools

## 📝 License

Copyright © 2025 [Krish Kumar](https://github.com/krishh-kumarr).

This project is [MIT](https://opensource.org/licenses/MIT) licensed.


</p>
