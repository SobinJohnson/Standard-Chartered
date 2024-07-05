// FileInput.js
import React, { useState } from "react";

const FileInput = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    onFileChange(file);
  };

  return (
    <div className="w-full h-full flex">
      <label
        htmlFor="fileInput"
        className="w-full bg-blue-500 text-white h-full px-4 py-2.5 rounded-lg"
      >
        {selectedFile ? `Selected File: ${selectedFile.name}` : "Upload File"}
      </label>
      <input
        id="fileInput"
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* {selectedFile && (
        <div>
          <p></p>
          <p>File Size: {Math.round(selectedFile.size / 1024)} KB</p>
        </div>
      )} */}
    </div>
  );
};

export default FileInput;
