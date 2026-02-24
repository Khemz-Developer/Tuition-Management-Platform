import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

/**
 * TeacherRoute: Only allows TEACHER role users.
 * Wrong-role users are redirected to their own dashboard.
 */
export default function TeacherRoute() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'TEACHER') {
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
