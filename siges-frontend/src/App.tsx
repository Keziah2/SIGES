import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SchoolsPage from './pages/SchoolsPage'; // Import the new page
import ProtectedRoute from './components/ProtectedRoute';
import apiClient from './services/api';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('accessToken'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers['Authorization'];
    setIsAuthenticated(false); 
    navigate('/login');
  };

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Initial check in case the component mounts after login/logout
    setIsAuthenticated(!!localStorage.getItem('accessToken'));
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/schools">Schools</Link></li> {/* New link */}
            </>
          )}
        </ul>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/schools" element={<SchoolsPage />} /> {/* New protected route */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
