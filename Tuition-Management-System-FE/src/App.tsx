import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './shared/hooks/useAuth'

// Admin/Teacher imports
import AdminLayout from './admin-teacher-web/layouts/AdminLayout'
import TeacherLayout from './admin-teacher-web/layouts/TeacherLayout'
import AdminDashboard from './admin-teacher-web/pages/admin/Dashboard'
import AdminTeachers from './admin-teacher-web/pages/admin/Teachers'
import AdminStudents from './admin-teacher-web/pages/admin/Students'
import AdminClasses from './admin-teacher-web/pages/admin/Classes'
import AdminClassDetail from './admin-teacher-web/pages/admin/ClassDetail'
import AdminSettings from './admin-teacher-web/pages/admin/Settings'
import AdminAuditLogs from './admin-teacher-web/pages/admin/AuditLogs'
import DynamicConfig from './admin-teacher-web/pages/admin/DynamicConfig'
import TeacherDashboard from './admin-teacher-web/pages/teacher/Dashboard'
import TeacherClasses from './admin-teacher-web/pages/teacher/Classes'
import TeacherClassDetail from './admin-teacher-web/pages/teacher/ClassDetail'
import TeacherSessions from './admin-teacher-web/pages/teacher/Sessions'
import TeacherCalendar from './admin-teacher-web/pages/teacher/Calendar'
import TeacherAttendance from './admin-teacher-web/pages/teacher/Attendance'
import TeacherContent from './admin-teacher-web/pages/teacher/Content'
import TeacherMessages from './admin-teacher-web/pages/teacher/Messages'
import TeacherProfile from './admin-teacher-web/pages/teacher/Profile'
import DynamicProfile from './admin-teacher-web/pages/teacher/DynamicProfile'
import TeacherLeads from './admin-teacher-web/pages/teacher/Leads'
import TeacherWebsite from './admin-teacher-web/pages/teacher/Website'

// Student imports
import StudentLayout from './student-web/layouts/StudentLayout'
import StudentDashboard from './student-web/pages/Dashboard'
import StudentClasses from './student-web/pages/Classes'
import StudentClassDetail from './student-web/pages/ClassDetail'
import StudentMyClasses from './student-web/pages/MyClasses'
import StudentMyClassDetail from './student-web/pages/MyClassDetail'
import StudentMessages from './student-web/pages/Messages'
import StudentProfile from './student-web/pages/Profile'
import StudentTeachers from './student-web/pages/Teachers'
import TeacherDirectory from './student-web/pages/Teachers'
import PublicTeacherProfile from './student-web/pages/PublicTeacherProfile'

// Auth imports
import AuthLayout from './shared/layouts/AuthLayout'
import Login from './shared/pages/auth/Login'
import Register from './shared/pages/auth/Register'
import ForgotPassword from './shared/pages/auth/ForgotPassword'
import ResetPassword from './shared/pages/auth/ResetPassword'

// Route guards
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import TeacherRoute from './routes/TeacherRoute'
import StudentRoute from './routes/StudentRoute'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/t/:teacherSlug" element={<PublicTeacherProfile />} />
      <Route path="/teachers" element={<TeacherDirectory />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/:teacherSlug" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/teachers/:id" element={<AdminTeachers />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/classes" element={<AdminClasses />} />
            <Route path="/admin/classes/:id" element={<AdminClassDetail />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/dynamic-config" element={<DynamicConfig />} />
          </Route>
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<TeacherRoute />}>
          <Route element={<TeacherLayout />}>
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/classes/create" element={<TeacherClasses />} />
            <Route path="/teacher/classes/:id" element={<TeacherClassDetail />} />
            <Route path="/teacher/classes/:id/students" element={<TeacherClassDetail />} />
            <Route path="/teacher/classes/:id/calendar" element={<TeacherClassDetail />} />
            <Route path="/teacher/classes/:id/attendance" element={<TeacherClassDetail />} />
            <Route path="/teacher/classes/:id/content" element={<TeacherClassDetail />} />
            <Route path="/teacher/sessions" element={<TeacherSessions />} />
            <Route path="/teacher/calendar" element={<TeacherCalendar />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/content" element={<TeacherContent />} />
            <Route path="/teacher/messages" element={<TeacherMessages />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
            <Route path="/teacher/profile/dynamic" element={<DynamicProfile />} />
            <Route path="/teacher/profile/website" element={<TeacherWebsite />} />
            <Route path="/teacher/leads" element={<TeacherLeads />} />
          </Route>
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<StudentRoute />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/classes/:id" element={<StudentClassDetail />} />
            <Route path="/student/my-classes" element={<StudentMyClasses />} />
            <Route path="/student/my-classes/:id" element={<StudentMyClassDetail />} />
            <Route path="/student/my-classes/:id/materials" element={<StudentMyClassDetail />} />
            <Route path="/student/my-classes/:id/calendar" element={<StudentMyClassDetail />} />
            <Route path="/student/my-classes/:id/attendance" element={<StudentMyClassDetail />} />
            <Route path="/student/my-classes/:id/messages" element={<StudentMyClassDetail />} />
            <Route path="/student/teachers" element={<StudentTeachers />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Default redirect based on role */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'ADMIN' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : user.role === 'TEACHER' ? (
              <Navigate to="/teacher/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
