import React, { useState, useRef } from 'react';

const FileInput = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={`relative p-6 border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-slate-900 bg-slate-50'
          : selectedFile
            ? 'border-slate-300 bg-white'
            : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-2 cursor-pointer">
        <div className="text-3xl">
          {selectedFile ? '✓' : '📎'}
        </div>
        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500">Max 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileInput;

