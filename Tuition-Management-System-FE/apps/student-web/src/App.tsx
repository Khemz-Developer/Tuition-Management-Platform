import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ClassesPage from './pages/Classes';
import TeachersPage from './pages/Teachers';
import PublicTeacherProfile from './pages/Public/TeacherProfile';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:teacherSlug" element={<Register />} />
          
          {/* Public Routes */}
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/t/:teacherSlug" element={<PublicTeacherProfile />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="classes" element={<ClassesPage />} />
                    <Route path="calendar" element={<div>Calendar</div>} />
                    <Route path="messages" element={<div>Messages</div>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
