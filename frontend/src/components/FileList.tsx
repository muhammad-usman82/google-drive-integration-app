import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../index.css';
import { deleteFile, downloadFile } from '../services/googleDriveService';

interface FileListProps {
  files: {
    id: string;
    name: string;
    modifiedTime: string;
    mimeType: string;     
  }[];
  onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRefresh }) => {
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});
  const [deleting, setDeleting] = useState<{ [key: string]: boolean }>({});
  const authContext = useContext(AuthContext);

  const handleDownload = async (fileId: string, fileName: string) => {
    if (!authContext?.accessToken) {
      console.error('User is not authenticated');
      alert('You must be logged in to download files.');
      return;
    }

    setDownloading((prev) => ({ ...prev, [fileId]: true }));
    try {
      const file = await downloadFile(fileId, authContext.accessToken);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file.');
    } finally {
      setDownloading((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!authContext?.accessToken) {
      console.error('User is not authenticated');
      alert('You must be logged in to delete files.');
      return;
    }

    setDeleting((prev) => ({ ...prev, [fileId]: true }));
    try {
      await deleteFile(fileId, authContext.accessToken);
      onRefresh();
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file.');
    } finally {
      setDeleting((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  return (
    <div className="file-list-container">
      <h2>Your Google Drive Files</h2>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id} className="file-list-item">
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-type">{file.mimeType}</span>
              <span className="file-modified">{new Date(file.modifiedTime).toLocaleString()}</span>
            </div>
            <div className="file-actions">
              <button
                onClick={() => handleDownload(file.id, file.name)}
                disabled={downloading[file.id] || deleting[file.id]}
                className="download-button"
              >
                {downloading[file.id] ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                disabled={deleting[file.id] || downloading[file.id]}
                className="delete-button"
              >
                {deleting[file.id] ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
