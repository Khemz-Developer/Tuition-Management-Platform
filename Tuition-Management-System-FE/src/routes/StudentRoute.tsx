import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

export default function StudentRoute() {
  const { user } = useAuth()

  if (user?.role !== 'STUDENT') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
