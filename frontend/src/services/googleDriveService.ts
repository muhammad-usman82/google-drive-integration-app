import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const listFiles = async (accessToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to list files');
    throw error;
  }
};

export const uploadFile = async (file: File, accessToken: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to upload file');
    throw error;
  }
};

export const downloadFile = async (fileId: string, accessToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/download/${fileId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to download file');
    throw error;
  }
};

export const deleteFile = async (fileId: string, accessToken: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete/${fileId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to delete file');
    throw error;
  }
};

const handleError = (error: any, message: string) => {
  console.error(message, error.response ? error.response.data : error.message);
  alert(message);
};
