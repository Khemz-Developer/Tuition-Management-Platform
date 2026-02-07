import { get, post } from './api'
import type { User, LoginCredentials, RegisterData, AuthResponse, AuthTokens } from '../types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return post<AuthResponse>('/auth/login', credentials)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return post<AuthResponse>('/auth/register', data)
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await post('/auth/logout', { refreshToken })
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return post<AuthTokens>('/auth/refresh', { refreshToken })
  },

  async getCurrentUser(): Promise<User> {
    return get<User>('/auth/me')
  },

  async forgotPassword(email: string): Promise<void> {
    await post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await post('/auth/reset-password', { token, password })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await post('/auth/change-password', { currentPassword, newPassword })
  },

  async verifyEmail(token: string): Promise<void> {
    await post('/auth/verify-email', { token })
  },

  async resendVerificationEmail(): Promise<void> {
    await post('/auth/resend-verification')
  },
}
