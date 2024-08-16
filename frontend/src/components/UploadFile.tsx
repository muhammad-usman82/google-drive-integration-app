import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../index.css'; // Import the CSS file
import { uploadFile } from '../services/googleDriveService';

interface UploadFileProps {
  onUploadSuccess: () => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  if (!authContext) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && authContext.accessToken) {
      setLoading(true);
      try {
        await uploadFile(selectedFile, authContext.accessToken);
        alert('File uploaded successfully!');
        onUploadSuccess();
      } catch (error) {
        console.error('Failed to upload file:', error);
        alert('Failed to upload file');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!authContext.isAuthenticated) {
    return (
      <div className="upload-file-container">
        <h2>You must be logged in to upload files</h2>
        <button className="login-button" onClick={authContext.login}>
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="upload-file-container">
      <h2>Upload File to Google Drive</h2>
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="upload-button"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
