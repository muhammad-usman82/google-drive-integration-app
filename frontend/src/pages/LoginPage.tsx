import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      // Redirect to home page if already authenticated
      navigate('/');
    }
  }, [authContext, navigate]);

  if (!authContext) {
    return null;
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={authContext.login}>Login with Google</button>
    </div>
  );
};
