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
  const [viewError, setViewError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments(currentUser.id);
      console.log('Fetched documents:', data.documents); // Log fetched documents
      setDocuments(data.documents || []); // Ensure we always set an array even if undefined
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      setDocuments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values, { resetForm, setSubmitting }) => {
    try {
      // Validate file exists
      if (!values.file) {
        setError('Please select a file to upload');
        setSubmitting(false);
        return;
      }

      // Create FormData properly
      const formData = new FormData();
      formData.append('documentType', values.documentType);
      formData.append('file', values.file);
      
      // Log form data for debugging
      console.log('Uploading document:', values.documentType);
      console.log('File name:', values.file.name);
      console.log('File type:', values.file.type);
      console.log('File size:', values.file.size);
      
      // Attempt upload
      const result = await uploadDocument(currentUser.id, formData);
      console.log('Upload response:', result);
      
      resetForm();
      setShowUploadModal(false);
      setUploadSuccess('Document uploaded successfully!');
      
      // Refresh the document list
      fetchDocuments();
    } catch (err) {
      console.error('Document upload error:', err);
      setError(err.message || 'Failed to upload document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowDocumentModal(true);
    setViewError(null);
  };

  const renderDocumentViewer = () => {
    if (!selectedDocument) return null;

    const fileUrl = selectedDocument.file_url;

    if (selectedDocument.file_name.toLowerCase().endsWith('.pdf')) {
        return (
            <iframe 
                src={fileUrl} 
                title={selectedDocument.document_type}
                width="100%" 
                height="500px"
                onError={() => setViewError('Failed to load the document. The file might not exist or be accessible.')}
            />
        );
    } else {
        return (
            <img 
                src={fileUrl}
                alt={selectedDocument.document_type}
                style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', margin: '0 auto' }}
                onError={() => setViewError('Failed to load the document. The file might not exist or be accessible.')}
            />
        );
    }
  };

  const renderDownloadButton = () => {
    if (!selectedDocument) return null;

    const fileUrl = selectedDocument.file_url;

    return (
        <Button 
            variant="primary" 
            href={fileUrl}
            target="_blank"
            download={selectedDocument.file_name}
        >
            Download
        </Button>
    );
  };

  const handleDeleteDocument = async () => {
    try {
      if (!documentToDelete) return;
      
      console.log(`Deleting document: ${documentToDelete.document_id}`);
      
      // Call to backend to delete document
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';
      console.log(`Using API URL: ${apiUrl}`);
      
      const response = await fetch(`${apiUrl}/api/students/${currentUser.id}/documents/${documentToDelete.document_id}`, {
        method: 'DELETE'
      });

      console.log(`Delete response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Failed to delete document (${response.status}): ${errorText}`);
      }

      // Remove document from state
      setDocuments(documents.filter(doc => doc.document_id !== documentToDelete.document_id));
      
      // Close modal and show success message
      setShowDeleteConfirmModal(false);
      setDocumentToDelete(null);
      setDeleteSuccess('Document deleted successfully');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setDeleteSuccess('');
      }, 5000);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message || 'Failed to delete document');
      setShowDeleteConfirmModal(false);
    }
  };

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
    setShowDeleteConfirmModal(true);
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
      {deleteSuccess && <Alert variant="success">{deleteSuccess}</Alert>}
      
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
                      <div className="d-flex gap-2">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleViewDocument(doc)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDeleteClick(doc)}
                        >
                          Remove
                        </Button>
                      </div>
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

      {/* Document Viewer Modal */}
      <Modal 
        show={showDocumentModal} 
        onHide={() => setShowDocumentModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedDocument?.document_type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewError && (
            <Alert variant="danger">
              {viewError}
            </Alert>
          )}
          
          {renderDocumentViewer()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>
            Close
          </Button>
          {renderDownloadButton()}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the document <strong>{documentToDelete?.document_type}</strong> ({documentToDelete?.file_name})?
          <p className="text-danger mt-2">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDocument}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Documents;
