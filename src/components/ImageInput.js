import React from 'react';
import { IconButton } from "@mui/material";
import { Image, Close } from "@mui/icons-material";
import './ImageInput.css';

function ImageInput({ onFileChange, selectedFile, onClear }) {
  return (
    <div className="image-input">
      {!selectedFile ? (
        <label htmlFor="file-input" style={{ cursor: "pointer" }}>
          <IconButton component="span">
            <Image />
          </IconButton>
        </label>
      ) : (
        <div className="selected-file">
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Preview" 
            className="image-preview"
          />
          <IconButton 
            onClick={onClear}
            className="clear-image"
            size="small"
          >
            <Close />
          </IconButton>
        </div>
      )}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />
    </div>
  );
}

export default ImageInput;