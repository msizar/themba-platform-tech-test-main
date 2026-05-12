import React, { useState } from 'react';
import FileInput from './components/FileInput';
import './index.css';

const App = () => {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Description is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Description must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Description must not exceed 1000 characters';
    }

    if (!file) {
      newErrors.file = 'Please select a file to upload';
    } else if (file.size > 10 * 1024 * 1024) {
      newErrors.file = 'File size must not exceed 10MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: '', message: '' });
    setFile(null);
    setResponse(null);
    setError(null);
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);


    try {
      let fileData = null;
      if (file) {
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: file.name,
            type: file.type,
            data: reader.result.split(',')[1] // Get base64 part
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          file: fileData
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.errors) {
          setErrors(errorData.errors);
          setError('Please fix the form errors');
        } else {
          setError(errorData.error || `Server error: ${res.statusText}`);
        }
        return;
      }

      const data = await res.json();
      setResponse(data);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {!showResults ? (
          <>
            <div className="mb-12">
              <h1 className="text-3xl font-light text-slate-900 mb-2">
                Submit Your Work
              </h1>
              <p className="text-sm text-slate-500 font-light">
                Share your latest project with us
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-0 py-2 bg-transparent border-b transition-colors text-sm placeholder:text-slate-400 focus:outline-none ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-slate-900'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-3">
                  Description
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your work..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-0 py-2 bg-transparent border-b transition-colors text-sm placeholder:text-slate-400 resize-none focus:outline-none ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-slate-900'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-3">
                  Attachment
                </label>
                <FileInput
                  onFileSelect={(selectedFile) => {
                    setFile(selectedFile);
                    setErrors((prev) => ({ ...prev, file: '' }));
                  }}
                  selectedFile={file}
                />
                {errors.file && (
                  <p className="text-xs text-red-600 mt-2">{errors.file}</p>
                )}
              </div>

               <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-medium py-3 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : 'Submit'}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium">
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-3xl font-light text-slate-900 mb-2">
                ✓ Submitted
              </h1>
              <p className="text-sm text-slate-500 font-light">
                Your submission was successful
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded">
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-emerald-700 font-medium mb-1">Name</p>
                    <p className="text-slate-900">{response.name}</p>
                  </div>
                  <div>
                    <p className="text-emerald-700 font-medium mb-1">Message</p>
                    <p className="text-slate-900">{response.message}</p>
                  </div>
                  {response.filePath && (
                    <div>
                      <p className="text-emerald-700 font-medium mb-1">File Location</p>
                      <p className="text-slate-600 break-all font-mono text-xs bg-white p-2 rounded border border-emerald-100">
                        {response.filePath}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-3 transition-colors rounded"
              >
                Submit Another Form
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;


