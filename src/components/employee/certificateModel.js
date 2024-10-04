import React from 'react';
import jsPDF from 'jspdf';
import '../../App.css';

const CertificateModal = ({ isOpen, onClose, employeeName, courseName, courseDuration, difficultyLevel }) => {
  if (!isOpen) return null;

  // Function to download the certificate as a PDF
  const downloadCertificate = () => {
    const doc = new jsPDF('landscape');

    // Add outer border
    doc.setDrawColor(0);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 275, 187); // Outer border

    // Add a "Certified" watermark in the background
    doc.setFontSize(100);
    doc.setTextColor(240);
    doc.text('CERTIFIED', 150, 120, null, null, 'center');

    // Add Certificate Title
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('Certificate of Completion', 140, 50, null, null, 'center');

    // Add Certificate ID
    const certificateID = `CERT-${new Date().getTime()}`;
    doc.setFontSize(12);
    doc.text(`Certificate ID: ${certificateID}`, 200, 25); // Place ID in the top-right corner

    // Add subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text(`This is to certify that`, 140, 75, null, null, 'center');

    // Add employee's name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(employeeName, 140, 90, null, null, 'center');

    // Add course completion text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text(`has successfully completed the course`, 140, 110, null, null, 'center');
    
    // Add course name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(courseName, 140, 125, null, null, 'center');

    // Add course details (duration and difficulty)
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(16);
    doc.text(`Course Duration: ${courseDuration}, Difficulty: ${difficultyLevel}`, 140, 140, null, null, 'center');

    // Add date of issue
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, 160);

    // Add signature line
    doc.line(220, 160, 270, 160); // Signature line
    doc.text('Authorized Signature', 245, 170, null, null, 'center');

    // Add an official stamp or seal line
    doc.setFontSize(14);
    doc.text('Official Stamp', 30, 170);

    doc.save(`${employeeName}_${courseName}_certificate.pdf`);
  };

  return (
    <div className="cert-modal-overlay">
    <div className="cert-modal-content">
        <h2 className="certificate-heading">🎓 Course Completion Certificate</h2>
        
        <div className="certificate-body">
        <p className="certificate-text">
            This certifies that <strong>{employeeName}</strong> has successfully completed the course <strong>{courseName}</strong>.
        </p>
        <p className="certificate-info">
            <span>Course Duration:</span> {courseDuration}, 
            <span> Difficulty:</span> {difficultyLevel}
        </p>
        <p className="certificate-date">
            <span>Date:</span> {new Date().toLocaleDateString()}
        </p>
        </div>
        
        <div className="certificate-actions">
        <button className="download-button" onClick={downloadCertificate}>Download Certificate</button>
        <button className="back-button" onClick={onClose}>Close</button>
        </div>
    </div>
    </div>

  );
};

export default CertificateModal;
