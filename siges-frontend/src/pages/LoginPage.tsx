import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api'; // Import the configured axios instance

const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await apiClient.post('/token/', {
        email: email, 
        password: password,
      });
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        // Update apiClient default Authorization header for subsequent requests in this session
        apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
        if (onLoginSuccess) onLoginSuccess(); navigate('/dashboard'); 
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.response && err.response.data) {
        // Handle cases where 'detail' might not be the error key (e.g. validation errors)
        const errors = err.response.data;
        let errorMessages = [];
        for (const key in errors) {
          errorMessages.push(`${key}: ${errors[key].join ? errors[key].join(', ') : errors[key]}`);
        }
        setError(errorMessages.join('; ') || 'Login failed. Please check your credentials.');
      }
       else {
        setError('Login failed. Please check your credentials or server status.');
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
