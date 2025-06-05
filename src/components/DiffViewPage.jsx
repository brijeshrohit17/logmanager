import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
 
const DiffViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const allResults = location.state?.results || [];
  const [filterText, setFilterText] = useState('');
 
  const filteredResults = allResults.filter((entry) =>
    entry.className.toLowerCase().includes(filterText.toLowerCase()) ||
    entry.methodName.toLowerCase().includes(filterText.toLowerCase())
  );
 
  // Function to download the report as CSV
  const downloadCSV = () => {
    const csvContent = [
      ['Class', 'Method', 'Line', 'Old Logger', 'Suggested Logger'], // Header row
      ...filteredResults.map(entry => [
        entry.className,
        entry.methodName,
        entry.lineNumber,
        entry.oldLogger || '—',
        entry.suggestedLogger
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');
 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'logger_enhancement_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
 
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Logger Enhancement Results</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Upload Another</button>
      </div>
 
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Filter by class or method name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Form.Group>
 
      {/* Download Button */}
      <Button
        variant="primary"
        className="mb-3"
        onClick={downloadCSV}
        disabled={filteredResults.length === 0}
      >
        Download Report
      </Button>
 
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Class</th>
              <th>Method</th>
              <th>Line</th>
              <th>Old Logger</th>
              <th>Suggested Logger</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No matching results.</td>
              </tr>
            ) : (
              filteredResults.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.className}</td>
                  <td>{entry.methodName}</td>
                  <td>{entry.lineNumber}</td>
                  <td className="bg-warning-subtle"><pre className="mb-0">{entry.oldLogger || '—'}</pre></td>
                  <td className="bg-success-subtle"><pre className="mb-0">{entry.suggestedLogger}</pre></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default DiffViewPage;
