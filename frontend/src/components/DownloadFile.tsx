import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { downloadFile } from '../services/googleDriveService';

interface DownloadFileProps {
  fileId: string;
  fileName: string;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({ fileId, fileName }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleDownload = async () => {
    if (!authContext?.accessToken) {
      console.error('User is not authenticated');
      alert('You must be logged in to download files.');
      return;
    }

    setIsDownloading(true);

    try {
      const file = await downloadFile(fileId, authContext.accessToken);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'downloaded_file');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('File download failed:', error);
      alert('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Downloading...' : 'Download'}
    </button>
  );
};
