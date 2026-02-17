import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  User,
  TeacherProfile,
  StudentProfile,
  Class,
  CreateClassRequest,
  UpdateClassRequest,
  Session,
  CreateSessionRequest,
  Attendance,
  MarkAttendanceRequest,
  Enrollment,
  CreateEnrollmentRequest,
  Unit,
  CreateUnitRequest,
  Lesson,
  CreateLessonRequest,
  Material,
  UploadMaterialRequest,
  Conversation,
  Message,
  SendMessageRequest,
  Announcement,
  CreateAnnouncementRequest,
  Notification,
  AdminDashboardStats,
  TeacherDashboardStats,
  StudentDashboardStats,
  WebsiteConfig,
  Lead,
  AdminAuditLog,
  ApproveTeacherRequest,
  RejectTeacherRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      );
      if (response.data.success && response.data.data) {
        this.setTokens(
          response.data.data.accessToken,
          response.data.data.refreshToken
        );
        return response.data.data.accessToken;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', data);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
    } finally {
      this.clearTokens();
    }
  }

  // Paginated requests
  async getPaginated<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(url, { params });
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<AdminDashboardStats> {
    return this.get<AdminDashboardStats>('/admin/dashboard');
  }

  async getTeachers(params?: Record<string, any>): Promise<PaginatedResponse<TeacherProfile>> {
    return this.getPaginated<TeacherProfile>('/admin/teachers', params);
  }

  async getTeacherById(teacherId: string): Promise<TeacherProfile> {
    return this.get<TeacherProfile>(`/admin/teachers/${teacherId}`);
  }

  async approveTeacher(data: ApproveTeacherRequest): Promise<TeacherProfile> {
    return this.post<TeacherProfile>(`/admin/teachers/${data.teacherId}/approve`, { reason: data.reason });
  }

  async rejectTeacher(data: RejectTeacherRequest): Promise<TeacherProfile> {
    return this.post<TeacherProfile>(`/admin/teachers/${data.teacherId}/reject`, { reason: data.reason });
  }

  async getStudents(params?: Record<string, any>): Promise<PaginatedResponse<StudentProfile>> {
    return this.getPaginated<StudentProfile>('/admin/students', params);
  }

  async getClasses(params?: Record<string, any>): Promise<PaginatedResponse<Class>> {
    return this.getPaginated<Class>('/admin/classes', params);
  }

  async getAuditLogs(params?: Record<string, any>): Promise<PaginatedResponse<AdminAuditLog>> {
    return this.getPaginated<AdminAuditLog>('/admin/audit-logs', params);
  }

  // Teacher endpoints
  async getTeacherDashboard(): Promise<TeacherDashboardStats> {
    return this.get<TeacherDashboardStats>('/teacher/dashboard');
  }

  async getRegisteredStudents(params?: Record<string, any>): Promise<PaginatedResponse<StudentProfile>> {
    return this.getPaginated<StudentProfile>('/teacher/students', params);
  }

  async getTeacherProfile(): Promise<TeacherProfile> {
    return this.get<TeacherProfile>('/teacher/profile');
  }

  async updateTeacherProfile(data: Partial<TeacherProfile>): Promise<TeacherProfile> {
    return this.put<TeacherProfile>('/teacher/profile', data);
  }

  async getTeacherClasses(params?: Record<string, any>): Promise<PaginatedResponse<Class>> {
    return this.getPaginated<Class>('/teacher/classes', params);
  }

  async getTeacherClassById(classId: string): Promise<Class> {
    return this.get<Class>(`/teacher/classes/${classId}`);
  }

  async createClass(data: CreateClassRequest): Promise<Class> {
    return this.post<Class>('/teacher/classes', data);
  }

  async updateClass(classId: string, data: UpdateClassRequest): Promise<Class> {
    return this.put<Class>(`/teacher/classes/${classId}`, data);
  }

  async deleteClass(classId: string): Promise<void> {
    return this.delete<void>(`/teacher/classes/${classId}`);
  }

  async getClassEnrollments(classId: string, params?: Record<string, any>): Promise<PaginatedResponse<Enrollment>> {
    return this.getPaginated<Enrollment>(`/teacher/classes/${classId}/enrollments`, params);
  }

  async approveEnrollment(enrollmentId: string): Promise<Enrollment> {
    return this.post<Enrollment>(`/teacher/enrollments/${enrollmentId}/approve`);
  }

  async rejectEnrollment(enrollmentId: string, reason?: string): Promise<Enrollment> {
    return this.post<Enrollment>(`/teacher/enrollments/${enrollmentId}/reject`, { reason });
  }

  async getSessions(classId?: string, params?: Record<string, any>): Promise<PaginatedResponse<Session>> {
    const url = classId ? `/teacher/classes/${classId}/sessions` : '/teacher/sessions';
    return this.getPaginated<Session>(url, params);
  }

  async createSession(data: CreateSessionRequest): Promise<Session> {
    return this.post<Session>('/teacher/sessions', data);
  }

  async updateSession(sessionId: string, data: Partial<CreateSessionRequest>): Promise<Session> {
    return this.put<Session>(`/teacher/sessions/${sessionId}`, data);
  }

  async deleteSession(sessionId: string): Promise<void> {
    return this.delete<void>(`/teacher/sessions/${sessionId}`);
  }

  async getSessionAttendance(sessionId: string): Promise<Attendance[]> {
    return this.get<Attendance[]>(`/teacher/sessions/${sessionId}/attendance`);
  }

  async markAttendance(data: MarkAttendanceRequest): Promise<Attendance> {
    return this.post<Attendance>('/teacher/attendance', data);
  }

  async getUnits(classId: string): Promise<Unit[]> {
    return this.get<Unit[]>(`/teacher/classes/${classId}/units`);
  }

  async createUnit(data: CreateUnitRequest): Promise<Unit> {
    return this.post<Unit>('/teacher/units', data);
  }

  async updateUnit(unitId: string, data: Partial<CreateUnitRequest>): Promise<Unit> {
    return this.put<Unit>(`/teacher/units/${unitId}`, data);
  }

  async deleteUnit(unitId: string): Promise<void> {
    return this.delete<void>(`/teacher/units/${unitId}`);
  }

  async getLessons(unitId: string): Promise<Lesson[]> {
    return this.get<Lesson[]>(`/teacher/units/${unitId}/lessons`);
  }

  async createLesson(data: CreateLessonRequest): Promise<Lesson> {
    return this.post<Lesson>('/teacher/lessons', data);
  }

  async updateLesson(lessonId: string, data: Partial<CreateLessonRequest>): Promise<Lesson> {
    return this.put<Lesson>(`/teacher/lessons/${lessonId}`, data);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    return this.delete<void>(`/teacher/lessons/${lessonId}`);
  }

  async uploadMaterial(data: UploadMaterialRequest): Promise<Material> {
    return this.post<Material>('/teacher/materials', data);
  }

  async deleteMaterial(materialId: string): Promise<void> {
    return this.delete<void>(`/teacher/materials/${materialId}`);
  }

  async getConversations(params?: Record<string, any>): Promise<PaginatedResponse<Conversation>> {
    return this.getPaginated<Conversation>('/teacher/conversations', params);
  }

  async getConversationMessages(conversationId: string, params?: Record<string, any>): Promise<PaginatedResponse<Message>> {
    return this.getPaginated<Message>(`/teacher/conversations/${conversationId}/messages`, params);
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.post<Message>('/teacher/messages', data);
  }

  async createAnnouncement(data: CreateAnnouncementRequest): Promise<Announcement> {
    return this.post<Announcement>('/teacher/announcements', data);
  }

  async getWebsiteConfig(): Promise<WebsiteConfig> {
    return this.get<WebsiteConfig>('/teacher/website/config');
  }

  async updateWebsiteConfig(data: Partial<WebsiteConfig>): Promise<WebsiteConfig> {
    return this.put<WebsiteConfig>('/teacher/website/config', data);
  }

  async getLeads(params?: Record<string, any>): Promise<PaginatedResponse<Lead>> {
    return this.getPaginated<Lead>('/teacher/leads', params);
  }

  // Student endpoints
  async getStudentDashboard(): Promise<StudentDashboardStats> {
    return this.get<StudentDashboardStats>('/student/dashboard');
  }

  async getStudentProfile(): Promise<StudentProfile> {
    return this.get<StudentProfile>('/student/profile');
  }

  async updateStudentProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    return this.put<StudentProfile>('/student/profile', data);
  }

  async browseClasses(params?: Record<string, any>): Promise<PaginatedResponse<Class>> {
    return this.getPaginated<Class>('/student/classes', params);
  }

  async getClassDetails(classId: string): Promise<Class> {
    return this.get<Class>(`/student/classes/${classId}`);
  }

  async requestEnrollment(data: CreateEnrollmentRequest): Promise<Enrollment> {
    return this.post<Enrollment>('/student/enrollments', data);
  }

  async getMyEnrollments(params?: Record<string, any>): Promise<PaginatedResponse<Enrollment>> {
    return this.getPaginated<Enrollment>('/student/enrollments', params);
  }

  async getMySessions(params?: Record<string, any>): Promise<PaginatedResponse<Session>> {
    return this.getPaginated<Session>('/student/sessions', params);
  }

  async getMyAttendance(classId?: string, params?: Record<string, any>): Promise<PaginatedResponse<Attendance>> {
    const url = classId ? `/student/classes/${classId}/attendance` : '/student/attendance';
    return this.getPaginated<Attendance>(url, params);
  }

  async getClassContent(classId: string): Promise<Unit[]> {
    return this.get<Unit[]>(`/student/classes/${classId}/content`);
  }

  async getLessonContent(lessonId: string): Promise<Lesson> {
    return this.get<Lesson>(`/student/lessons/${lessonId}`);
  }

  async getStudentConversations(params?: Record<string, any>): Promise<PaginatedResponse<Conversation>> {
    return this.getPaginated<Conversation>('/student/conversations', params);
  }

  async getStudentConversationMessages(conversationId: string, params?: Record<string, any>): Promise<PaginatedResponse<Message>> {
    return this.getPaginated<Message>(`/student/conversations/${conversationId}/messages`, params);
  }

  async sendStudentMessage(data: SendMessageRequest): Promise<Message> {
    return this.post<Message>('/student/messages', data);
  }

  // Notifications
  async getNotifications(params?: Record<string, any>): Promise<PaginatedResponse<Notification>> {
    return this.getPaginated<Notification>('/notifications', params);
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    return this.put<Notification>(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return this.put<void>('/notifications/read-all');
  }

  // File upload
  async uploadFile(file: File, type: 'image' | 'document' | 'video'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Public endpoints
  async getPublicTeacherProfile(slug: string): Promise<TeacherProfile> {
    return this.get<TeacherProfile>(`/public/teachers/${slug}`);
  }

  async getPublicTeacherClasses(slug: string): Promise<Class[]> {
    return this.get<Class[]>(`/public/teachers/${slug}/classes`);
  }

  async submitLead(data: Partial<Lead>): Promise<Lead> {
    return this.post<Lead>('/public/leads', data);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
