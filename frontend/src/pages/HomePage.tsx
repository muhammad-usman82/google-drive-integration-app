import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileList } from '../components/FileList';
import { UploadFile } from '../components/UploadFile';
import { AuthContext } from '../context/AuthContext';
import { listFiles } from '../services/googleDriveService';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && authContext) {
      setLoading(true);
      axios.post(`${apiUrl}/auth/callback`, { code })
        .then(response => {
          authContext.setTokens({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            tokenType: response.data.token_type,
            expiryDate: response.data.expiry_date,
          });
          navigate('/', { replace: true });
        })
        .catch(error => {
          console.error('Authentication failed:', error);
          alert('Authentication failed. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams, apiUrl, authContext, navigate]);

  useEffect(() => {
    if (authContext?.accessToken) {
      refreshFileList();
    }
  }, [authContext]);

  const refreshFileList = () => {
    if (authContext?.accessToken) {
      listFiles(authContext.accessToken)
        .then(setFiles)
        .catch((error) => {
          console.error('Failed to load files:', error);
          alert('Failed to load files. Please try again.');
        });
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>Google Drive Integration</h1>
      <UploadFile onUploadSuccess={refreshFileList} />
      <FileList files={files} onRefresh={refreshFileList} />
    </div>
  );
};
