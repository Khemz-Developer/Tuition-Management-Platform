import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuth()

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'TEACHER') {
      return <Navigate to="/teacher/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-2xl font-bold">Tuition MS</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
