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
      formData.append('file', values.file);
  
      await uploadDocument(currentUser.id, formData);
      
      resetForm();
      setShowUploadModal(false);
      setUploadSuccess('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    documentType: Yup.string().required('Document type is required'),
    file: Yup.mixed()
      .required('File is required')
      .test(
        'fileType',
        'Unsupported file format',
        value => value && ['application/pdf', 'image/jpeg', 'image/png'].includes(value.type)
      )
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
                  <th>Type</th>
                  <th>File Name</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.document_id}>
                    <td>{doc.document_type}</td>
                    <td>{doc.file_name}</td>
                    <td>{new Date(doc.upload_date).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        href={`http://localhost:5000/uploads/${doc.file_name}`}
                        target="_blank"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No documents available.</p>
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
          initialValues={{ documentType: '', file: null }}
          validationSchema={validationSchema}
          onSubmit={handleUpload}
        >
          {({ handleSubmit, setFieldValue, values, touched, errors, isSubmitting }) => (
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Document Type</Form.Label>
                  <Form.Select
                    name="documentType"
                    value={values.documentType}
                    onChange={(e) => setFieldValue('documentType', e.target.value)}
                    isInvalid={touched.documentType && !!errors.documentType}
                  >
                    <option value="">Select document type</option>
                    <option value="Report Card">Report Card</option>
                    <option value="Transfer Certificate">Transfer Certificate</option>
                    <option value="ID Proof">ID Proof</option>
                    <option value="Marksheet">Marksheet</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.documentType}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Select File (PDF, JPG, PNG)</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue('file', file);
                    }}
                    isInvalid={touched.file && !!errors.file}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.file}
                  </Form.Control.Feedback>
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
