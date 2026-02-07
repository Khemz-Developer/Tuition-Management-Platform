import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

export default function TeacherRoute() {
  const { user } = useAuth()

  if (user?.role !== 'TEACHER') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
