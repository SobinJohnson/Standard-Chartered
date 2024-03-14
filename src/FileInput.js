// FileInput.js
import React, { useState } from 'react';

const FileInput = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    onFileChange(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <p>File Size: {Math.round(selectedFile.size / 1024)} KB</p>
        </div>
      )}
    </div>
  );
};

export default FileInput;
