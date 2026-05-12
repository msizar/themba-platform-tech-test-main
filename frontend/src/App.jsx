import React, { useState } from 'react';
import FileInput from './components/FileInput';
import './index.css';

const App = () => {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
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
        throw new Error(errorData.error || `Server error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
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
              className="w-full px-0 py-2 bg-transparent border-b border-slate-200 focus:border-slate-900 focus:outline-none transition-colors text-sm placeholder:text-slate-400"
              required
            />
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
              className="w-full px-0 py-2 bg-transparent border-b border-slate-200 focus:border-slate-900 focus:outline-none transition-colors text-sm placeholder:text-slate-400 resize-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-3">
              Attachment
            </label>
            <FileInput 
              onFileSelect={(selectedFile) => setFile(selectedFile)} 
              selectedFile={file}
            />
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
        
        {response && (
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Success</h2>
            <pre className="text-xs font-mono text-slate-600 overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


