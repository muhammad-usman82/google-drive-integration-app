import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  accessToken: string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string; tokenType: string; expiryDate: number }) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to initiate login process.');
    }
  };

  const logout = () => {
    axios.post(`${apiUrl}/auth/logout`).then(() => {
      setIsAuthenticated(false);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      navigate('/login');
    });
  };

  const setTokens = ({ accessToken, refreshToken, tokenType, expiryDate }: { accessToken: string; refreshToken: string; tokenType: string; expiryDate: number }) => {
    setAccessToken(accessToken);
    setIsAuthenticated(true);
    localStorage.setItem('accessToken', accessToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};
