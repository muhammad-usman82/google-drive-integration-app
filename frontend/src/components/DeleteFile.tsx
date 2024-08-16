import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { deleteFile } from '../services/googleDriveService';

interface DeleteFileProps {
  fileId: string;
  onDeleteSuccess?: () => void;
}

export const DeleteFile: React.FC<DeleteFileProps> = ({ fileId, onDeleteSuccess }) => {
  const authContext = useContext(AuthContext);

  const handleDelete = async () => {
    if (!authContext?.accessToken) {
      alert('You must be logged in to delete files.');
      return;
    }

    try {
      await deleteFile(fileId, authContext.accessToken);
      alert('File deleted successfully!');
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file.');
    }
  };

  return (
    <button onClick={handleDelete} disabled={!authContext?.accessToken}>
      Delete
    </button>
  );
};
