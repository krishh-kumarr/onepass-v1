import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { getDocuments, uploadDocument } from '../../services/studentService';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Documents = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments(currentUser.id);
      setDocuments(data.documents);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('documentType', values.documentType);
      formData.append('fileName', values.fileName);
      
      // In a real app, you would append the actual file here
      // formData.append('file', values.file);
      
      await uploadDocument(currentUser.id, formData);
      resetForm();
      setShowUploadModal(false);
      setUploadSuccess('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      setError('Failed to upload document');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
    
    setTimeout(() => {
      setUploadSuccess('');
    }, 3000);
  };

  const validationSchema = Yup.object({
    documentType: Yup.string().required('Document type is required'),
    fileName: Yup.string().required('File name is required'),
    // In a real app, you would validate the file here
  });

  if (loading) return <div className="text-center p-5">Loading documents...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">My Documents</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}
      
      <Card className="shadow mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
          <h5 className="m-0">Document List</h5>
          <Button variant="light" onClick={() => setShowUploadModal(true)}>
            Upload New Document
          </Button>
        </Card.Header>
        <Card.Body>
          {documents.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.document_id}>
                    <td>{doc.document_id}</td>
                    <td>{doc.document_type}</td>
                    <td>{doc.file_name}</td>
                    <td>{new Date(doc.upload_date).toLocaleDateString()}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">
                        View
                      </Button>
                      <Button variant="secondary" size="sm">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No documents available.</p>
              <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                Upload Your First Document
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Upload Document Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Document</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ documentType: '', fileName: '', file: null }}
          validationSchema={validationSchema}
          onSubmit={handleUpload}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Document Type</Form.Label>
                  <Form.Select
                    name="documentType"
                    value={values.documentType}
                    onChange={handleChange}
                    isInvalid={touched.documentType && !!errors.documentType}
                  >
                    <option value="">Select document type</option>
                    <option value="ID Card">ID Card</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Address Proof">Address Proof</option>
                    <option value="Academic Certificate">Academic Certificate</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.documentType}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>File Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fileName"
                    value={values.fileName}
                    onChange={handleChange}
                    isInvalid={touched.fileName && !!errors.fileName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fileName}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Select File</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files[0]) {
                        setFieldValue('file', e.currentTarget.files[0]);
                        if (!values.fileName) {
                          setFieldValue('fileName', e.currentTarget.files[0].name);
                        }
                      }
                    }}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Uploading...' : 'Upload Document'}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Documents;