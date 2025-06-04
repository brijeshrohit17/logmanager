import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a .zip file to upload.');
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('${process.env.REACT_APP_API_BASE_URL}/logEnchanceApi/uploadzip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/diff', { state: { results: response.data } });
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Logger Enhancement Tool</h2>
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <input type="file" className="form-control mb-3" accept=".zip" onChange={handleFileChange} />
        <button className="btn btn-primary w-100" onClick={handleUpload} disabled={loading}>
          {loading ? <><Spinner size="sm" animation="border" className="me-2" /> Processing...</> : 'Upload Java Project for Logger Enhancement'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default UploadPage;