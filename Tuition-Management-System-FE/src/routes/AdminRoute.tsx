import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

/**
 * AdminRoute: Only allows ADMIN role users.
 * Wrong-role users are redirected to their own dashboard.
 */
export default function AdminRoute() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'ADMIN') {
    const redirectPath = user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
