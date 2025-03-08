import React from 'react';
import { Dialog, IconButton } from '@mui/material';
import { Close, Download } from '@mui/icons-material';
import './ImagePreviewModal.css';

function ImagePreviewModal({ open, onClose, imageUrl }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      classes={{ paper: 'image-preview-modal' }}
    >
      <div className="image-preview-header">
        <IconButton onClick={handleDownload} className="download-button">
          <Download />
        </IconButton>
        <IconButton onClick={onClose} className="close-button">
          <Close />
        </IconButton>
      </div>
      <div className="image-preview-content">
        <img src={imageUrl} alt="Preview" className="full-image" />
      </div>
    </Dialog>
  );
}

export default ImagePreviewModal;