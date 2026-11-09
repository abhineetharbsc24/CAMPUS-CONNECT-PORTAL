import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthModule from './components/AuthModule.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import FacultyPortal from './pages/FacultyPortal.jsx';
import AdminPortal from './pages/AdminPortal.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={null} />
      <Route path="/login" element={<AuthModule key="login" mode="login" />} />
      <Route path="/register" element={<AuthModule key="register" mode="register" />} />
      <Route path="/student/*" element={<ProtectedRoute role="student"><StudentPortal /></ProtectedRoute>} />
      <Route path="/faculty/*" element={<ProtectedRoute role="faculty"><FacultyPortal /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>} />
    </Routes>
  );
}
