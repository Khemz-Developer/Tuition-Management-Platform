import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

/**
 * StudentRoute: Only allows STUDENT role users.
 * Wrong-role users are redirected to their own dashboard.
 */
export default function StudentRoute() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'STUDENT') {
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/teacher/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
