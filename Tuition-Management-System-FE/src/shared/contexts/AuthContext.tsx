import { createContext, useCallback, useEffect, useState, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { getAccessToken, setAccessToken, clearAccessToken } from '../services/api'
import type { User, LoginCredentials, RegisterData, AuthTokens } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Get the default dashboard path for a given user role.
 */
function getRoleDashboard(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'TEACHER':
      return '/teacher/dashboard'
    case 'STUDENT':
      return '/student/dashboard'
    default:
      return '/'
  }
}

/**
 * Validate that a redirect path is safe (same-origin, no protocol injection).
 */
function isSafeRedirect(path: string): boolean {
  if (!path) return false
  // Must start with / and not with // (protocol-relative URL)
  if (!path.startsWith('/') || path.startsWith('//')) return false
  // Block javascript: or data: schemes
  if (/^\/*(javascript|data|vbscript):/i.test(path)) return false
  return true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const saveTokens = (tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken)
  }

  const clearTokens = () => {
    clearAccessToken()
  }

  const refreshUser = useCallback(async () => {
    try {
      // If access token exists in memory, use it; otherwise try cookie-based refresh.
      if (!getAccessToken()) {
        const refreshedTokens = await authService.refreshToken()
        saveTokens(refreshedTokens)
      }

      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      saveTokens(response.tokens)
      setUser(response.user)
      
      // Redirect after login: use saved location if safe, else role dashboard
      const savedLocation = (location.state as any)?.from?.pathname
      const searchParams = new URLSearchParams(location.search)
      const redirectParam = searchParams.get('redirect')
      
      const redirectTo = savedLocation || redirectParam
      if (redirectTo && isSafeRedirect(redirectTo)) {
        navigate(redirectTo, { replace: true })
      } else {
        navigate(getRoleDashboard(response.user.role), { replace: true })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      saveTokens(response.tokens)
      setUser(response.user)
      
      // Navigate to role-appropriate dashboard
      navigate(getRoleDashboard(response.user.role), { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call backend logout to revoke refresh token
      await authService.logout()
    } catch (error) {
      // Logout should always succeed client-side even if backend call fails
    } finally {
      clearTokens()
      setUser(null)
      navigate('/login', { replace: true })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
