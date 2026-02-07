# Tuition Management Platform - Full Stack Development Guide

A comprehensive phase-by-phase guide for building the complete Tuition Management Platform from scratch.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Project Setup & Infrastructure](#phase-1-project-setup--infrastructure)
4. [Phase 2: Database Design & Models](#phase-2-database-design--models)
5. [Phase 3: Authentication System](#phase-3-authentication-system)
6. [Phase 4: Core Backend APIs](#phase-4-core-backend-apis)
7. [Phase 5: Admin Module](#phase-5-admin-module)
8. [Phase 6: Teacher Module](#phase-6-teacher-module)
9. [Phase 7: Student Module](#phase-7-student-module)
10. [Phase 8: Frontend - Shared Foundation](#phase-8-frontend---shared-foundation)
11. [Phase 9: Frontend - Admin Portal](#phase-9-frontend---admin-portal)
12. [Phase 10: Frontend - Teacher Portal](#phase-10-frontend---teacher-portal)
13. [Phase 11: Frontend - Student Portal](#phase-11-frontend---student-portal)
14. [Phase 12: Public Teacher Website](#phase-12-public-teacher-website)
15. [Phase 13: Real-time Features](#phase-13-real-time-features)
16. [Phase 14: AI Assistant Integration](#phase-14-ai-assistant-integration)
17. [Phase 15: Testing & Quality Assurance](#phase-15-testing--quality-assurance)
18. [Phase 16: Deployment & Production](#phase-16-deployment--production)
19. [Development Timeline](#development-timeline)
20. [Troubleshooting](#troubleshooting)

---

## Overview

### What We're Building

A comprehensive Tuition Management Platform with:
- **Admin Portal**: Manage teachers, students, classes, and system settings
- **Teacher Portal**: Manage classes, students, content, attendance, and messaging
- **Student Portal**: Browse classes, enroll, view content, track attendance
- **Public Teacher Websites**: SEO-optimized teacher profile pages with AI chat

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18+, Vite, TypeScript, TailwindCSS, shadcn/ui |
| **Backend** | NestJS, TypeScript, MongoDB, Mongoose |
| **Real-time** | Socket.io |
| **File Storage** | Cloudinary |
| **Authentication** | JWT (Access + Refresh tokens) |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React Vite)                    │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │  Admin Portal   │ Teacher Portal  │ Student Portal  │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │   Auth   │  Admin   │ Teacher  │ Student  │  Public  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Software

```bash
# Check versions
node --version    # v18.x or higher
npm --version     # v9.x or higher
git --version     # Any recent version
```

### Required Accounts

1. **MongoDB Atlas** - Free tier account for database
2. **Cloudinary** - Free tier for file storage
3. **GitHub** - For version control

### Development Environment

- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code

---

## Phase 1: Project Setup & Infrastructure

**Duration**: 1-2 days

### 1.1 Create Project Structure

```bash
# Create root directory
mkdir tuition-management-system
cd tuition-management-system

# Initialize git
git init

# Create folder structure
mkdir -p apps/api apps/web packages/shared
```

### 1.2 Backend Setup (NestJS)

```bash
cd apps/api

# Initialize NestJS project
npm i -g @nestjs/cli
nest new . --package-manager npm --skip-git

# Install core dependencies
npm install @nestjs/mongoose mongoose
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/config
npm install bcrypt class-validator class-transformer
npm install @nestjs/platform-socket.io socket.io
npm install cloudinary multer
npm install zod

# Install dev dependencies
npm install -D @types/bcrypt @types/passport-jwt @types/multer
```

### 1.3 Frontend Setup (React Vite)

```bash
cd ../web

# Create Vite project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install react-router-dom @tanstack/react-query axios
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react react-hook-form @hookform/resolvers zod
npm install socket.io-client
npm install recharts @fullcalendar/react @fullcalendar/daygrid

# Initialize Tailwind
npx tailwindcss init -p
```

### 1.4 Environment Configuration

**Backend `.env`:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tuition-management

# JWT
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### 1.5 Docker Setup (Optional)

**`docker-compose.yml`:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  api:
    build: ./apps/api
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/tuition-management

  web:
    build: ./apps/web
    ports:
      - "5173:80"
    depends_on:
      - api

volumes:
  mongodb_data:
```

### 1.6 Deliverables Checklist

- [ ] Project folder structure created
- [ ] Backend NestJS initialized with dependencies
- [ ] Frontend Vite React initialized with dependencies
- [ ] Environment files configured
- [ ] Git repository initialized with .gitignore
- [ ] Docker setup (optional)

---

## Phase 2: Database Design & Models

**Duration**: 2-3 days

### 2.1 Schema Design Overview

```
User (base authentication)
├── TeacherProfile (extended teacher info)
├── StudentProfile (extended student info)
│
Class (tuition batches)
├── Enrollment (student-class relationship)
├── Session (scheduled sessions)
│   └── Attendance (per session)
├── Unit (content organization)
│   └── Lesson (lesson content)
│       └── Material (attachments)
│
Conversation (messaging)
└── Message (individual messages)

Announcement (class announcements)
Notification (in-app notifications)
AdminAuditLog (admin actions)
Lead (public inquiries)
```

### 2.2 Create Mongoose Models

**Order of creation** (due to dependencies):

1. **User Model** (`src/models/user.schema.ts`)
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, required: true })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
```

2. **TeacherProfile Model**
3. **StudentProfile Model**
4. **Class Model**
5. **Enrollment Model**
6. **Session Model**
7. **Attendance Model**
8. **Unit Model**
9. **Lesson Model**
10. **Material Model**
11. **Conversation Model**
12. **Message Model**
13. **Announcement Model**
14. **Notification Model**
15. **AdminAuditLog Model**
16. **Lead Model**

### 2.3 Database Indexes

```typescript
// Performance indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isActive: 1 });

TeacherProfileSchema.index({ userId: 1 }, { unique: true });
TeacherProfileSchema.index({ slug: 1 }, { unique: true });
TeacherProfileSchema.index({ status: 1 });

ClassSchema.index({ teacherId: 1 });
ClassSchema.index({ subject: 1, grade: 1 });

EnrollmentSchema.index({ classId: 1, studentId: 1 }, { unique: true });
EnrollmentSchema.index({ studentId: 1, status: 1 });

AttendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

SessionSchema.index({ classId: 1, startDateTime: 1 });
```

### 2.4 Deliverables Checklist

- [ ] All 16 Mongoose schemas created
- [ ] Proper indexes defined
- [ ] Schema relationships documented
- [ ] Validation rules implemented
- [ ] Export barrel file created (`src/models/index.ts`)

---

## Phase 3: Authentication System

**Duration**: 2-3 days

### 3.1 Auth Module Structure

```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── register.dto.ts
│   ├── login.dto.ts
│   └── refresh-token.dto.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── jwt-refresh.strategy.ts
└── guards/
    └── jwt-auth.guard.ts
```

### 3.2 Implementation Steps

**Step 1: Create DTOs**
```typescript
// register.dto.ts
export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  teacherSlug?: string; // For teacher-linked registration
}
```

**Step 2: Create Auth Service**
```typescript
// Key methods
- register(dto: RegisterDto): Promise<AuthResponse>
- login(dto: LoginDto): Promise<AuthResponse>
- refreshToken(userId: string, refreshToken: string): Promise<AuthResponse>
- logout(userId: string): Promise<void>
- validateUser(email: string, password: string): Promise<User>
```

**Step 3: Create JWT Strategies**
- Access token strategy (15 min expiry)
- Refresh token strategy (7 day expiry)

**Step 4: Create Guards**
- JwtAuthGuard (default)
- RolesGuard (role-based access)
- PublicGuard (skip auth)

**Step 5: Create Decorators**
```typescript
// Custom decorators
@Public() - Mark route as public
@Roles('ADMIN', 'TEACHER') - Require specific roles
@CurrentUser() - Get current user from request
```

### 3.3 Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/refresh` | Refresh tokens | Public |
| POST | `/api/auth/logout` | Logout | Protected |
| GET | `/api/auth/me` | Get current user | Protected |

### 3.4 Deliverables Checklist

- [ ] DTOs with validation
- [ ] Auth service with all methods
- [ ] JWT strategies configured
- [ ] Guards implemented
- [ ] Custom decorators created
- [ ] Auth controller with all endpoints
- [ ] Password hashing with bcrypt
- [ ] Token rotation on refresh

---

## Phase 4: Core Backend APIs

**Duration**: 3-4 days

### 4.1 Module Structure

```
src/
├── admin/          # Admin endpoints
├── teacher/        # Teacher endpoints
├── student/        # Student endpoints
├── public/         # Public endpoints
├── upload/         # File upload
├── messaging/      # Real-time messaging
├── notifications/  # Notifications
├── health/         # Health check
├── config/         # Configuration
├── guards/         # Shared guards
├── decorators/     # Shared decorators
├── interceptors/   # Request/response interceptors
├── filters/        # Exception filters
└── utils/          # Utilities
```

### 4.2 Create Shared Infrastructure

**Step 1: Exception Filter**
```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Standardized error response
  }
}
```

**Step 2: Transform Interceptor**
```typescript
// transform.interceptor.ts
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
```

**Step 3: Pagination Utility**
```typescript
// pagination.util.ts
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T>
```

### 4.3 Upload Module

```typescript
// upload.service.ts
- uploadImage(file: Express.Multer.File): Promise<UploadResult>
- uploadDocument(file: Express.Multer.File): Promise<UploadResult>
- uploadVideo(file: Express.Multer.File): Promise<UploadResult>
- deleteFile(publicId: string): Promise<void>
```

### 4.4 Health Module

```typescript
// health.controller.ts
@Get()
healthCheck() {
  return { status: 'ok', timestamp: new Date() };
}

@Get('db')
async dbHealthCheck() {
  // Check MongoDB connection
}
```

### 4.5 Deliverables Checklist

- [ ] Project-wide exception filter
- [ ] Response transform interceptor
- [ ] Pagination utility
- [ ] Upload module with Cloudinary
- [ ] Health check endpoints
- [ ] Database configuration module
- [ ] JWT configuration module

---

## Phase 5: Admin Module

**Duration**: 3-4 days

### 5.1 Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/teachers` | List teachers (with filters) |
| GET | `/api/admin/teachers/:id` | Get teacher details |
| PUT | `/api/admin/teachers/:id/approve` | Approve teacher |
| PUT | `/api/admin/teachers/:id/reject` | Reject teacher |
| GET | `/api/admin/students` | List students |
| GET | `/api/admin/classes` | List all classes |
| GET | `/api/admin/audit-logs` | Get audit logs |
| PUT | `/api/admin/settings` | Update site settings |

### 5.2 Dashboard Analytics

```typescript
// analytics.service.ts
getDashboardStats() {
  return {
    totalTeachers: number,
    pendingApprovals: number,
    totalStudents: number,
    totalClasses: number,
    recentActivity: Activity[],
    chartData: {
      enrollmentsTrend: DataPoint[],
      attendanceStats: DataPoint[],
    }
  };
}
```

### 5.3 Audit Logging

```typescript
// Log all important admin actions
- Teacher approval/rejection
- User status changes
- Settings updates
- Manual data modifications
```

### 5.4 Deliverables Checklist

- [ ] Admin controller with all endpoints
- [ ] Admin service with business logic
- [ ] Dashboard analytics service
- [ ] Teacher approval workflow
- [ ] Audit logging system
- [ ] Site settings management

---

## Phase 6: Teacher Module

**Duration**: 4-5 days

### 6.1 Teacher Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Profile** |
| GET | `/api/teacher/profile` | Get own profile |
| PUT | `/api/teacher/profile` | Update profile |
| PUT | `/api/teacher/profile/website` | Update website config |
| **Classes** |
| GET | `/api/teacher/classes` | List own classes |
| POST | `/api/teacher/classes` | Create class |
| GET | `/api/teacher/classes/:id` | Get class details |
| PUT | `/api/teacher/classes/:id` | Update class |
| DELETE | `/api/teacher/classes/:id` | Delete class |
| **Enrollments** |
| GET | `/api/teacher/classes/:id/enrollments` | List enrollments |
| PUT | `/api/teacher/enrollments/:id/approve` | Approve enrollment |
| PUT | `/api/teacher/enrollments/:id/reject` | Reject enrollment |
| **Sessions** |
| GET | `/api/teacher/sessions` | List sessions |
| POST | `/api/teacher/sessions` | Create session |
| PUT | `/api/teacher/sessions/:id` | Update session |
| DELETE | `/api/teacher/sessions/:id` | Cancel session |
| **Attendance** |
| GET | `/api/teacher/sessions/:id/attendance` | Get attendance |
| POST | `/api/teacher/sessions/:id/attendance` | Mark attendance |
| **Content** |
| GET | `/api/teacher/classes/:id/units` | List units |
| POST | `/api/teacher/units` | Create unit |
| POST | `/api/teacher/lessons` | Create lesson |
| POST | `/api/teacher/materials` | Upload material |
| **Leads** |
| GET | `/api/teacher/leads` | List leads |
| PUT | `/api/teacher/leads/:id` | Update lead status |

### 6.2 Class Management

```typescript
// class.service.ts
- createClass(teacherId, dto): Promise<Class>
- updateClass(classId, dto): Promise<Class>
- getClassWithStudents(classId): Promise<ClassWithStudents>
- getClassStatistics(classId): Promise<ClassStats>
```

### 6.3 Content Management

```typescript
// Hierarchical content structure
Class
└── Unit (e.g., "Chapter 1: Introduction")
    └── Lesson (e.g., "1.1 Basic Concepts")
        └── Material (PDF, Video, Link)
```

### 6.4 Session Scheduling

```typescript
// Support for:
- One-time sessions
- Recurring sessions (daily, weekly, monthly)
- Session cancellation with notifications
- Session rescheduling
```

### 6.5 Deliverables Checklist

- [ ] Teacher profile management
- [ ] Class CRUD operations
- [ ] Enrollment approval workflow
- [ ] Session scheduling (one-time + recurring)
- [ ] Attendance marking system
- [ ] Content management (units/lessons/materials)
- [ ] Lead management
- [ ] Website customization endpoints

---

## Phase 7: Student Module

**Duration**: 3-4 days

### 7.1 Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Profile** |
| GET | `/api/student/profile` | Get own profile |
| PUT | `/api/student/profile` | Update profile |
| **Classes** |
| GET | `/api/student/classes` | Browse available classes |
| GET | `/api/student/classes/:id` | Get class details |
| POST | `/api/student/classes/:id/enroll` | Request enrollment |
| **My Classes** |
| GET | `/api/student/my-classes` | List enrolled classes |
| GET | `/api/student/my-classes/:id` | Get enrolled class details |
| **Content** |
| GET | `/api/student/classes/:id/units` | Get class content |
| GET | `/api/student/lessons/:id` | Get lesson details |
| **Sessions** |
| GET | `/api/student/sessions` | Get upcoming sessions |
| GET | `/api/student/calendar` | Get calendar view |
| **Attendance** |
| GET | `/api/student/attendance` | Get attendance history |
| **Teachers** |
| GET | `/api/student/teachers` | Browse teachers |

### 7.2 Class Discovery

```typescript
// Browse classes with filters
- Search by title, subject
- Filter by grade, subject
- Sort by date, popularity
- Pagination
```

### 7.3 Enrollment Flow

```typescript
// Student enrollment workflow
1. Student discovers class
2. Student requests enrollment
3. Teacher receives notification
4. Teacher approves/rejects
5. Student notified of decision
6. If approved, student can access content
```

### 7.4 Deliverables Checklist

- [ ] Student profile management
- [ ] Class browsing with search/filter
- [ ] Enrollment request system
- [ ] My classes view
- [ ] Content viewing (read-only)
- [ ] Session calendar
- [ ] Attendance history
- [ ] Teacher discovery

---

## Phase 8: Frontend - Shared Foundation

**Duration**: 3-4 days

### 8.1 Project Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── lib/
│   ├── utils.ts
│   ├── queryClient.ts
│   └── socket.ts
├── shared/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Auth pages
│   │   └── guards/       # Route guards
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── SocketContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePagination.ts
│   │   └── useSocketEvent.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── upload.service.ts
│   └── types/
│       ├── user.types.ts
│       ├── class.types.ts
│       └── api.types.ts
├── admin-teacher-web/    # Admin + Teacher portal
└── student-web/          # Student portal
```

### 8.2 UI Components (shadcn/ui)

Create these base components:
```
Button, Input, Textarea, Label
Card, Dialog, Sheet
Table, Badge, Avatar
Select, Checkbox, Switch
Tabs, Separator, ScrollArea
Alert, Toast (Sonner)
DropdownMenu
```

### 8.3 Auth Context

```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

### 8.4 API Service

```typescript
// api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add interceptors for:
// - Attaching access token
// - Auto-refresh on 401
// - Error handling
```

### 8.5 Routing Setup

```typescript
// App.tsx
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/t/:teacherSlug" element={<PublicTeacherProfile />} />
  
  {/* Admin routes */}
  <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
  
  {/* Teacher routes */}
  <Route path="/teacher/*" element={<TeacherRoute><TeacherLayout /></TeacherRoute>} />
  
  {/* Student routes */}
  <Route path="/student/*" element={<StudentRoute><StudentLayout /></StudentRoute>} />
</Routes>
```

### 8.6 Deliverables Checklist

- [ ] Project structure setup
- [ ] All shadcn/ui components created
- [ ] Auth context and provider
- [ ] Theme context (dark/light mode)
- [ ] API service with interceptors
- [ ] Route guards (ProtectedRoute, AdminRoute, etc.)
- [ ] Auth pages (Login, Register, ForgotPassword)
- [ ] Shared types defined

---

## Phase 9: Frontend - Admin Portal

**Duration**: 4-5 days

### 9.1 Admin Pages

```
/admin/dashboard      - Overview stats and charts
/admin/teachers       - Teachers list with filters
/admin/teachers/:id   - Teacher detail with approval
/admin/students       - Students list
/admin/classes        - All classes overview
/admin/settings       - Site settings
/admin/audit-logs     - Audit log viewer
```

### 9.2 AdminLayout

```typescript
// Components
- Sidebar with navigation
- Header with user menu
- Theme toggle
- Notification bell
- Main content area with Outlet
```

### 9.3 Admin Dashboard

```typescript
// Dashboard components
- Stats cards (teachers, students, classes, pending)
- Enrollment trend chart (Recharts)
- Recent activity feed
- Pending approvals quick actions
```

### 9.4 Teacher Management

```typescript
// Features
- Teachers table with status filter
- Teacher detail modal/page
- Approve/reject with reason
- View teacher's classes and students
```

### 9.5 Deliverables Checklist

- [ ] AdminLayout with sidebar navigation
- [ ] Dashboard page with stats and charts
- [ ] Teachers management page
- [ ] Students management page
- [ ] Classes overview page
- [ ] Settings page
- [ ] Audit logs viewer

---

## Phase 10: Frontend - Teacher Portal

**Duration**: 5-6 days

### 10.1 Teacher Pages

```
/teacher/dashboard           - Teacher overview
/teacher/classes             - My classes list
/teacher/classes/create      - Create new class
/teacher/classes/:id         - Class detail
/teacher/classes/:id/students - Class students
/teacher/classes/:id/content - Content management
/teacher/sessions            - Session management
/teacher/attendance          - Attendance marking
/teacher/messages            - Messaging center
/teacher/profile             - Profile settings
/teacher/profile/website     - Website customization
/teacher/leads               - Lead management
```

### 10.2 Class Management UI

```typescript
// Class creation form
- Basic info (title, description, subject, grade)
- Schedule settings
- Fee settings (optional)
- Capacity settings
- Visibility toggle (public/private)
```

### 10.3 Content Builder

```typescript
// Hierarchical content editor
- Unit list with drag-drop ordering
- Lesson editor with rich content
- Material upload (PDF, video, images)
- Publish/draft status
```

### 10.4 Session Calendar

```typescript
// Calendar features (FullCalendar)
- Month/week/day views
- Create session by clicking
- Drag to reschedule
- Recurring session support
- Color coding by class
```

### 10.5 Attendance System

```typescript
// Attendance marking
- Select session
- Student list with status toggle
- Bulk mark present/absent
- Add notes per student
- View attendance history
```

### 10.6 Deliverables Checklist

- [ ] TeacherLayout with navigation
- [ ] Dashboard with class stats
- [ ] Classes CRUD pages
- [ ] Class detail with tabs (students, content, settings)
- [ ] Content management (units/lessons/materials)
- [ ] Session calendar with CRUD
- [ ] Attendance marking interface
- [ ] Messaging center
- [ ] Profile and website customization
- [ ] Lead management page

---

## Phase 11: Frontend - Student Portal

**Duration**: 4-5 days

### 11.1 Student Pages

```
/student/dashboard                - Student overview
/student/classes                  - Browse available classes
/student/classes/:id              - Class details + enroll
/student/my-classes               - Enrolled classes
/student/my-classes/:id           - Enrolled class content
/student/my-classes/:id/materials - View materials
/student/my-classes/:id/calendar  - Class calendar
/student/messages                 - Messaging
/student/profile                  - Profile settings
/student/teachers                 - Browse teachers
/student/teachers/:id             - Teacher public profile
```

### 11.2 Class Discovery

```typescript
// Class browsing features
- Search by keyword
- Filter by subject, grade
- Sort options
- Card/list view toggle
- Enrollment request button
```

### 11.3 My Classes View

```typescript
// Enrolled class features
- Content viewer (units/lessons/materials)
- Session calendar
- Attendance history
- Class chat access
- Material downloads
```

### 11.4 Student Dashboard

```typescript
// Dashboard components
- Enrolled classes summary
- Upcoming sessions widget
- Recent materials
- Unread messages indicator
- Quick actions
```

### 11.5 Deliverables Checklist

- [ ] StudentLayout with navigation
- [ ] Dashboard with widgets
- [ ] Class browsing page
- [ ] Class detail with enrollment
- [ ] My classes list
- [ ] Enrolled class content viewer
- [ ] Session calendar view
- [ ] Attendance history
- [ ] Messaging page
- [ ] Profile management
- [ ] Teacher browsing and profiles

---

## Phase 12: Public Teacher Website

**Duration**: 3-4 days

### 12.1 Public Website Components

```
/t/:teacherSlug - Dynamic public teacher page

Components:
- HeroSection
- AboutSection
- ClassesSection
- ScheduleSection
- TestimonialsSection
- FAQSection
- ContactSection
- AIChatWidget
```

### 12.2 Page Renderer System

```typescript
// Dynamic section rendering
interface PageConfig {
  sections: {
    type: 'hero' | 'about' | 'classes' | etc;
    order: number;
    visible: boolean;
    config: SectionConfig;
  }[];
}

// PageRenderer reads config and renders sections in order
```

### 12.3 Website Builder (Teacher Dashboard)

```typescript
// Teacher customization features
- Theme customization (colors, fonts)
- Section ordering (drag-drop)
- Section visibility toggles
- Content editing
- SEO settings
- Live preview
```

### 12.4 SEO Optimization

```typescript
// SEO features
- Dynamic meta tags
- Open Graph tags
- Structured data (JSON-LD)
- Semantic HTML
- Fast loading
```

### 12.5 Deliverables Checklist

- [ ] All section components created
- [ ] PageRenderer with dynamic rendering
- [ ] Public route at /t/:teacherSlug
- [ ] Website builder in teacher dashboard
- [ ] Theme customization
- [ ] Section management
- [ ] SEO optimization

---

## Phase 13: Real-time Features

**Duration**: 2-3 days

### 13.1 Socket.io Setup

**Backend Gateway:**
```typescript
// messaging.gateway.ts
@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' }
})
export class MessagingGateway {
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {}
  
  @SubscribeMessage('send-message')
  handleMessage(client: Socket, data: MessageDto) {}
  
  @SubscribeMessage('typing')
  handleTyping(client: Socket, data: TypingDto) {}
}
```

**Frontend Socket Context:**
```typescript
// SocketContext.tsx
- Connect on auth
- Disconnect on logout
- Room management
- Event subscriptions
- Reconnection handling
```

### 13.2 Real-time Features

```typescript
// Messaging
- Real-time message delivery
- Typing indicators
- Read receipts
- Online status

// Notifications
- Push notifications
- Notification bell updates
- Toast notifications

// Live Updates
- Enrollment status changes
- Session updates
- Attendance notifications
```

### 13.3 Deliverables Checklist

- [ ] Socket.io gateway on backend
- [ ] Socket context on frontend
- [ ] Real-time messaging
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Live notifications
- [ ] Online status indicators

---

## Phase 14: AI Assistant Integration

**Duration**: 2-3 days

### 14.1 AI Chat Widget

```typescript
// AIChatWidget.tsx
- Floating chat button
- Chat window with messages
- Quick reply suggestions
- Lead capture form
- Disclaimer display
```

### 14.2 AI Service (Backend)

```typescript
// ai.service.ts
- Process user query
- Fetch relevant teacher data
- Generate response using:
  - Teacher profile
  - Public classes
  - FAQ items
  - Schedule preview
- Capture lead if contact info provided
```

### 14.3 AI Context Rules

```typescript
// AI can only access:
- Public teacher profile fields
- Public class information
- Teacher-provided FAQs
- Public schedule
- Platform policies

// AI cannot reveal:
- Private student information
- Private class chats
- Teacher private contact info
- Internal notes
```

### 14.4 Lead Capture

```typescript
// Lead model
{
  teacherId: ObjectId,
  name: string,
  email?: string,
  phone?: string,
  grade?: string,
  subject?: string,
  message: string,
  source: 'AI_CHAT' | 'CONTACT_FORM',
  status: 'NEW' | 'CONTACTED' | 'CONVERTED',
  createdAt: Date
}
```

### 14.5 Deliverables Checklist

- [ ] AI chat widget component
- [ ] AI service on backend
- [ ] Context-aware response generation
- [ ] Lead capture system
- [ ] Lead management for teachers
- [ ] AI safety rules implemented

---

## Phase 15: Testing & Quality Assurance

**Duration**: 3-4 days

### 15.1 Backend Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

**Test Coverage Goals:**
- Auth service: 90%+
- Core services: 80%+
- Controllers: 70%+

### 15.2 Frontend Testing

```bash
# Component tests
npm run test

# E2E with Playwright
npm run test:e2e
```

### 15.3 Testing Checklist

**Authentication:**
- [ ] Register with valid data
- [ ] Register with invalid data (validation)
- [ ] Login success
- [ ] Login failure
- [ ] Token refresh
- [ ] Logout

**Authorization:**
- [ ] Admin can access admin routes
- [ ] Teacher cannot access admin routes
- [ ] Student cannot access teacher routes
- [ ] Unauthenticated users redirected

**Core Flows:**
- [ ] Teacher approval workflow
- [ ] Class creation
- [ ] Student enrollment
- [ ] Session scheduling
- [ ] Attendance marking
- [ ] Content viewing
- [ ] Messaging

### 15.4 Performance Testing

```typescript
// Key metrics to check
- API response times < 200ms
- Page load times < 2s
- Database query times < 100ms
```

### 15.5 Deliverables Checklist

- [ ] Unit tests for auth service
- [ ] Unit tests for core services
- [ ] Integration tests for API
- [ ] Component tests for key UI
- [ ] E2E tests for critical flows
- [ ] Performance benchmarks
- [ ] Security audit

---

## Phase 16: Deployment & Production

**Duration**: 2-3 days

### 16.1 Pre-deployment Checklist

**Environment:**
- [ ] Production environment variables set
- [ ] Strong JWT secrets (32+ chars)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Logging configured

**Security:**
- [ ] All endpoints properly protected
- [ ] Input validation on all routes
- [ ] File upload limits configured
- [ ] Error messages don't leak info

**Performance:**
- [ ] Database indexes created
- [ ] Static assets optimized
- [ ] Caching configured
- [ ] Compression enabled

### 16.2 Backend Deployment

**Option A: Railway/Render**
```bash
# Create project on Railway
# Connect GitHub repo
# Set environment variables
# Deploy
```

**Option B: AWS EC2/DigitalOcean**
```bash
# Setup server
# Install Node.js, PM2
# Clone repo and install deps
# Setup Nginx reverse proxy
# Configure SSL
# Start with PM2
```

### 16.3 Frontend Deployment

**Option A: Vercel**
```bash
# Connect GitHub repo
# Configure build settings
# Set environment variables
# Deploy
```

**Option B: Netlify**
```bash
# Connect GitHub repo
# Build command: npm run build
# Publish directory: dist
# Deploy
```

### 16.4 Database Setup

**MongoDB Atlas:**
1. Create cluster
2. Create database user
3. Whitelist IP addresses
4. Get connection string
5. Run seed script

### 16.5 Post-deployment

- [ ] SSL certificates working
- [ ] Domain configured
- [ ] Health check passing
- [ ] Monitoring setup (Sentry, etc.)
- [ ] Backup strategy configured
- [ ] CI/CD pipeline setup

### 16.6 Deliverables Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and seeded
- [ ] SSL/TLS configured
- [ ] Domain configured
- [ ] Monitoring active
- [ ] Documentation updated

---

## Development Timeline

### Estimated Duration by Phase

| Phase | Description | Duration | Cumulative |
|-------|-------------|----------|------------|
| 1 | Project Setup | 1-2 days | 2 days |
| 2 | Database & Models | 2-3 days | 5 days |
| 3 | Authentication | 2-3 days | 8 days |
| 4 | Core Backend APIs | 3-4 days | 12 days |
| 5 | Admin Module | 3-4 days | 16 days |
| 6 | Teacher Module | 4-5 days | 21 days |
| 7 | Student Module | 3-4 days | 25 days |
| 8 | Frontend Foundation | 3-4 days | 29 days |
| 9 | Admin Portal UI | 4-5 days | 34 days |
| 10 | Teacher Portal UI | 5-6 days | 40 days |
| 11 | Student Portal UI | 4-5 days | 45 days |
| 12 | Public Website | 3-4 days | 49 days |
| 13 | Real-time Features | 2-3 days | 52 days |
| 14 | AI Assistant | 2-3 days | 55 days |
| 15 | Testing & QA | 3-4 days | 59 days |
| 16 | Deployment | 2-3 days | 62 days |

**Total: ~9-12 weeks for a single developer**

### Parallel Development (Team)

With a team of 2-3 developers:

```
Developer 1: Backend (Phases 2-7)
Developer 2: Frontend (Phases 8-11)
Developer 3: Public Website, Real-time, AI (Phases 12-14)

Timeline reduces to: 5-7 weeks
```

---

## Troubleshooting

### Common Issues

**MongoDB Connection:**
```bash
# Error: MongoServerError: bad auth
# Solution: Check username/password in connection string
# Ensure IP is whitelisted in Atlas
```

**JWT Issues:**
```bash
# Error: JsonWebTokenError: invalid signature
# Solution: Ensure same secret is used for sign and verify
# Check token hasn't been modified
```

**CORS Errors:**
```bash
# Error: CORS policy blocked
# Solution: Add frontend URL to CORS origins
# Ensure credentials: true if using cookies
```

**Socket.io Connection:**
```bash
# Error: WebSocket connection failed
# Solution: Check CORS settings on gateway
# Verify socket URL matches backend
```

### Getting Help

1. Check error logs
2. Search documentation
3. Stack Overflow
4. NestJS Discord
5. React Discord

---

## Quick Reference

### Commands

```bash
# Backend
cd apps/api
npm run start:dev        # Development
npm run build            # Build
npm run start:prod       # Production
npm run test             # Tests

# Frontend
cd apps/web
npm run dev              # Development
npm run build            # Build
npm run preview          # Preview build
npm run test             # Tests

# Database
npm run seed             # Seed database
```

### Key Files

```
Backend:
- src/main.ts            # Entry point
- src/app.module.ts      # Root module
- src/auth/              # Authentication
- src/models/            # Database schemas

Frontend:
- src/main.tsx           # Entry point
- src/App.tsx            # Root with routing
- src/shared/            # Shared code
- src/admin-teacher-web/ # Admin+Teacher portal
- src/student-web/       # Student portal
```

---

**Good luck with your development! 🚀**

---

*Last Updated: February 2026*
