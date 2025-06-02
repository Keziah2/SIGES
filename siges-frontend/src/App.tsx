import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import apiClient from './services/api';

function App() {
  const navigate = useNavigate();
  // Check for token presence to update UI dynamically.
  // Note: This is a simple check. For robust auth, consider context or state management.
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('accessToken'));

  React.useEffect(() => {
    // Listen to storage changes to update auth state (e.g., if token is removed by another tab)
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Initial check
    setIsAuthenticated(!!localStorage.getItem('accessToken'));
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers['Authorization'];
    setIsAuthenticated(false); // Update state
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {!isAuthenticated ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <li><button onClick={handleLogout}>Logout</button></li>
          )}
          {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
        </ul>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Consider passing setIsAuthenticated to LoginPage */}
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
