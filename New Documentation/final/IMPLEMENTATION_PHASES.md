# Implementation Phases - Detailed Breakdown

## Phase 1: Project Scaffolding & Setup

### Tasks
1. **Monorepo Structure**
   - Initialize workspace with npm/yarn workspaces or pnpm
   - Create directory structure:
     ```
     apps/
       admin-teacher-web/
       student-web/
       api/
     packages/
       shared/
     ```
   - Setup root `package.json` with workspaces

2. **TypeScript Configuration**
   - `tsconfig.json` at root (base config)
   - `tsconfig.json` for each app (extends base)
   - Type definitions for shared package

3. **Build Tools**
   - Vite config for React apps
   - NestJS setup for API
   - Build scripts in package.json

4. **Shared Package**
   - Setup `packages/shared/package.json`
   - Create types directory (User, Class, Enrollment, etc.)
   - Create Zod schemas directory
   - Create utilities directory

5. **Linting & Formatting**
   - ESLint config (extends recommended)
   - Prettier config
   - Husky pre-commit hooks (optional)

6. **Docker Setup**
   - `docker-compose.yml` for local dev
   - MongoDB service
   - API service (optional, for consistency)
   - Volume mounts for hot reload

7. **Environment Files**
   - `.env.example` for each app
   - Document all required variables

**Deliverables**: Working monorepo structure, all apps can start, Docker Compose runs MongoDB

---

## Phase 2: Database & Authentication

### Database Setup
1. **Mongoose Models**
   - User model
   - TeacherProfile model
   - StudentProfile model
   - Class model
   - Enrollment model
   - Session model
   - Attendance model
   - Unit/Lesson/Material models
   - Conversation/Message models
   - Announcement model
   - Notification model
   - AdminAuditLog model
   - Lead model

2. **Indexes**
   - Unique indexes (email, slug)
   - Compound indexes (classId + studentId)
   - Performance indexes (status, createdAt, etc.)

3. **Database Connection**
   - Mongoose connection setup
   - Connection error handling
   - Retry logic

### Authentication
1. **JWT Service**
   - Generate access token (15 min expiry)
   - Generate refresh token (7 days expiry)
   - Verify tokens
   - Token refresh logic

2. **Password Hashing**
   - bcrypt service
   - Hash password on registration
   - Compare password on login

3. **Auth Endpoints**
   - `POST /api/auth/register` (role-based, with optional `teacherId`/`teacherSlug` for student-teacher linking)
   - `POST /api/auth/login`
   - `POST /api/auth/refresh`
   - `POST /api/auth/logout`
   - `GET /api/auth/me`

4. **Auth Guards/Middleware**
   - JWT guard (verify access token)
   - Role guard (ADMIN, TEACHER, STUDENT)
   - Optional: Permission-based guards

5. **Validation**
   - Zod schemas for register/login
   - Input validation middleware

6. **Rate Limiting**
   - NestJS Throttler module (@nestjs/throttler)
   - Apply to auth endpoints using @Throttle() decorator
   - Configurable limits

**Deliverables**: Working auth system, users can register/login, JWT tokens issued

---

## Phase 3: Core Entities & CRUD

### User Management
1. **User Service**
   - Create user
   - Update user
   - Get user by ID
   - List users (with pagination/filtering)

2. **Teacher Profile**
   - Create teacher profile on registration
   - Update teacher profile
   - Get teacher profile
   - List teachers (with filters)

3. **Student Profile**
   - Create student profile on registration
   - Update student profile
   - Get student profile
   - Add `preferredTeachers` array for teacher-student linking
   - Add `registeredWithTeacherAt` timestamp

4. **Teacher-Student Relationships**
   - `GET /api/teacher/students` - Get teacher's registered/linked students
   - `GET /api/student/teachers` - Get student's linked teachers
   - Link student to teacher on registration (if teacherId/teacherSlug provided)
   - Validate teacher is APPROVED before linking

### Class Management
1. **Class Service**
   - Create class
   - Update class
   - Delete class (soft delete or hard)
   - Get class by ID
   - List classes (with filters)
   - Generate invite code/link

2. **Enrollment Service**
   - Request enrollment
   - Approve enrollment
   - Reject enrollment
   - Remove enrollment
   - List enrollments (with filters)
   - Check enrollment status

### Content Management
1. **Unit Service**
   - Create unit
   - Update unit
   - Delete unit
   - Reorder units
   - List units for class

2. **Lesson Service**
   - Create lesson
   - Update lesson
   - Delete lesson
   - Reorder lessons
   - List lessons for unit

3. **Material Service**
   - Upload material (Cloudinary integration)
   - Delete material
   - List materials for lesson
   - Validate file types/sizes

### Session Management
1. **Session Service**
   - Create session (single)
   - Create recurring sessions
   - Update session
   - Delete session
   - Cancel session
   - List sessions (with date filters)
   - Get calendar view

2. **Recurrence Logic**
   - Parse recurrence rules
   - Generate session instances
   - Handle exceptions (cancelled instances)

### Attendance Management
1. **Attendance Service**
   - Mark attendance (bulk)
   - Update attendance
   - Get attendance for session
   - Get attendance history for student
   - Calculate attendance percentage

**Deliverables**: All CRUD operations working, data flows correctly

---

## Phase 4: Admin Portal

### Admin Dashboard
1. **Dashboard API**
   - Total counts (teachers, students, classes)
   - Pending approvals count
   - Recent activity
   - Per-teacher metrics

2. **Dashboard UI**
   - Stat cards
   - Charts (Recharts)
   - Recent activity feed
   - Quick actions

### Teacher Management
1. **Teacher List Page**
   - Table with filters (status, subject, grade)
   - Search functionality
   - Pagination
   - Actions: Approve, Reject, View

2. **Teacher Detail Page**
   - Teacher info display
   - Classes list
   - Student counts
   - Approval actions

3. **Approval Workflow**
   - Review teacher application
   - Approve with optional message
   - Reject with reason
   - Email notifications (optional)

### Student Management
1. **Student List Page**
   - Table with filters
   - Search
   - View student details
   - Suspend/unsuspend

### Class Management
1. **All Classes View**
   - List all classes across teachers
   - Filter by teacher, subject, grade
   - View class details

### Analytics
1. **Analytics API**
   - Per-teacher stats
   - Attendance trends
   - Enrollment trends
   - Revenue metrics (if fees enabled)

2. **Analytics UI**
   - Charts and graphs
   - Export functionality (optional)

### Audit Logs
1. **Audit Log Viewer**
   - List admin actions
   - Filter by action type, admin, date
   - View details

**Deliverables**: Fully functional admin portal, can approve teachers, view analytics

---

## Phase 5: Teacher Portal

### Teacher Dashboard
1. **Dashboard API**
   - Total classes, students
   - Upcoming sessions
   - Unread messages count
   - Recent activity

2. **Dashboard UI**
   - Stat cards
   - Upcoming sessions widget
   - Quick actions
   - Class overview cards

### Class Management UI
1. **Classes List**
   - List teacher's classes
   - Create new class button
   - Filter by status

2. **Class Detail Page**
   - Tabs: Overview, Students, Calendar, Attendance, Content, Messages
   - Overview: Stats, next session, recent materials
   - Students: List enrolled, pending requests, actions

### Calendar Interface
1. **Calendar Page**
   - FullCalendar integration
   - Month/Week/Day views
   - Create session modal
   - Edit session modal
   - Drag & drop (optional)

2. **Session Creation**
   - Form: Title, date/time, duration, recurrence
   - Recurrence options (daily, weekly, monthly)
   - Location/online link

### Attendance Interface
1. **Attendance Page**
   - List sessions
   - Mark attendance form (checkboxes/radio)
   - Bulk mark
   - Attendance summary

### Content Builder
1. **Units/Lessons Page**
   - Tree view or list
   - Create unit/lesson buttons
   - Drag to reorder
   - Edit inline or modal

2. **Lesson Editor**
   - Rich text editor (Tiptap or similar)
   - Content blocks (text, heading, list, embed)
   - Material upload section
   - Preview mode

3. **Material Upload**
   - Drag & drop upload
   - Progress indicator
   - File type validation
   - Preview for images/videos

### Messaging Interface
1. **Messages Page**
   - Conversation list (sidebar)
   - Message thread (main area)
   - Send message input
   - File attachments
   - Read receipts

2. **Announcements**
   - Create announcement form
   - List announcements
   - Edit/delete

### Profile Customization
1. **Profile Page**
   - Edit bio, subjects, grades
   - Upload profile/cover images
   - Privacy toggles
   - Theme customization
   - FAQs management
   - Highlights management

**Deliverables**: Fully functional teacher portal, can manage classes, content, sessions

---

## Phase 6: Student Portal

### Student Dashboard
1. **Dashboard API**
   - Upcoming sessions
   - New announcements
   - New materials
   - Unread messages

2. **Dashboard UI**
   - Upcoming sessions widget
   - New content cards
   - Quick links

### Teacher Directory & Public Profiles
1. **Teachers Page** (`student-web/pages/Teachers/`)
   - Browse approved teachers
   - Filter by subject, grade, location
   - Teacher cards with profiles
   - Link to public teacher pages

2. **Public Teacher Profile** (`student-web/pages/Public/[slug].tsx`)
   - Route: `/t/:teacherSlug`
   - Fetch teacher data from `GET /api/public/teachers/:slug`
   - Render using `PageRenderer` component
   - Dynamic sections based on `websiteConfig`
   - Contact/register CTA buttons

### Class Browsing
1. **Classes Page**
   - Browse/search classes
   - Filter by subject, grade, teacher
   - Class cards with details
   - Request enrollment button

2. **Class Detail Page**
   - Public class info
   - Request to join form
   - Teacher info

### My Classes
1. **Enrolled Classes List**
   - List enrolled classes
   - Quick stats (next session, new materials)

2. **Class Detail Page** (enrolled)
   - Tabs: Materials, Calendar, Attendance, Messages
   - Materials: Units → Lessons → Content
   - Calendar: Upcoming sessions
   - Attendance: History view
   - Messages: Class chat

### Content Viewing
1. **Lesson Viewer**
   - Display lesson content
   - Render content blocks
   - Material downloads/previews
   - Video player integration
   - PDF viewer integration

### Messaging
1. **Messages Page**
   - Conversation list
   - Message thread
   - Send messages
   - Notifications

**Deliverables**: Fully functional student portal, can browse classes, view content

---

## Phase 7: Public Teacher Website

### Database Schema Update
1. **Add websiteConfig to TeacherProfile**
   - Theme customization (primaryColor, accentColor, fontPairing, customCSS)
   - Sections array (id, type, order, visible, config)
   - Custom content (hero, about, etc.)
   - SEO settings (metaTitle, metaDescription, metaKeywords, ogImage)

### Backend API
1. **Website Configuration Endpoints**
   - `GET /api/teacher/website/config` - Get teacher's website config
   - `PUT /api/teacher/website/config` - Update website config
   - `POST /api/teacher/website/sections/reorder` - Reorder sections
   - `PUT /api/teacher/website/sections/:sectionId` - Update section config

2. **Public Endpoint Update**
   - Update `GET /api/public/teachers/:slug` to include `websiteConfig` in response

### Frontend - Public Teacher Page (in `student-web/`)

> **Note:** Public Teacher Website is integrated into the single frontend. Viewing components live in `student-web/`, management components in `admin-teacher-web/`, and shared types in `packages/shared/`.

1. **Route Setup** (`student-web/pages/Public/[slug].tsx`)
   - `/t/[slug]` route in student-web
   - Client-side rendering with SEO meta tags
   - Publicly accessible (no auth required)

2. **Dynamic Page Renderer** (`student-web/components/public-website/`)
   - Create `renderer/PageRenderer.tsx` component
   - Create `renderer/SectionFactory.tsx` to map section types to components
   - Read `websiteConfig.sections` array
   - Render sections in order based on `order` field
   - Only render sections where `visible: true`
   - Apply theme colors and fonts dynamically

3. **Section Components** (`student-web/components/public-website/sections/`)
   - HeroSection, AboutSection, SubjectsSection, ClassesSection
   - ScheduleSection, TestimonialsSection, HighlightsSection
   - ContactCTASection, CustomSection (for custom HTML)
   - Each section receives `config` and `teacherData` props

4. **Layout & Widgets** (`student-web/components/public-website/`)
   - `layout/PublicPageLayout.tsx` - Header, footer, navigation
   - `widgets/AIChatWidget.tsx` - AI assistant chat bubble
   - `widgets/ContactFormModal.tsx` - Lead capture form

5. **SEO Optimization**
   - Use `websiteConfig.seo` for meta tags
   - OpenGraph tags
   - Twitter cards
   - Structured data (JSON-LD)

6. **Theme Application**
   - Apply `websiteConfig.theme` colors via CSS variables
   - Apply font pairing
   - Inject custom CSS (sanitized)
   - Use `packages/shared/utils/themes/applyTheme.ts`

### Shared Package (`packages/shared/`)
1. **Website Types** (`types/website.types.ts`)
   - WebsiteConfig, ThemeConfig, SectionConfig interfaces
   - SectionType enum

2. **Validation Schemas** (`schemas/website.schema.ts`)
   - Zod schemas for website configuration validation

### Frontend - Teacher Dashboard (in `admin-teacher-web/`)
1. **Website Customization Interface** (`admin-teacher-web/components/website-builder/`)
   - Route: `/teacher/profile/website`
   - `ThemeCustomizer.tsx` - Color pickers, font selector, custom CSS editor
   - `SectionList.tsx` - Drag-and-drop section reordering
   - `SectionEditor.tsx` - Edit section-specific settings
   - `LivePreview.tsx` - Preview of public page
   - `SEOSettings.tsx` - Meta title, description, keywords

2. **Section Management**
   - Implement drag-and-drop using `@dnd-kit/core` or `react-beautiful-dnd`
   - Section visibility toggles
   - Section-specific configuration forms
   - Save changes to backend

### Lead Capture
1. **Contact Form**
   - Student name, grade, contact method
   - Preferred subject
   - Message
   - Submit → Create Lead record

2. **Lead Management**
   - Teacher can view leads in dashboard
   - Update lead status
   - Contact student

**Deliverables**: 
- Beautiful public teacher pages with dynamic section rendering
- SEO optimized with customizable meta tags
- Website configuration system working
- Teacher dashboard for managing website
- Lead capture working

---

## Phase 8: Real-time Features

### Socket.io Setup
1. **Server Setup**
   - Socket.io server initialization
   - CORS configuration
   - Authentication middleware (JWT)

2. **Client Setup**
   - Socket.io client in React apps
   - Connection management
   - Reconnection logic

### Real-time Messaging
1. **Message Events**
   - `message:send` - Send message
   - `message:received` - Receive message
   - `message:read` - Mark as read
   - `typing:start` - User typing
   - `typing:stop` - User stopped typing

2. **Room Management**
   - Join conversation room
   - Leave room
   - Private rooms for DMs
   - Class rooms for class chat

### Real-time Notifications
1. **Notification Events**
   - `notification:new` - New notification
   - `notification:read` - Mark as read

2. **Notification Types**
   - Enrollment request
   - New message
   - Session reminder
   - New announcement
   - New material

### Live Updates
1. **Attendance Updates**
   - Real-time attendance marking
   - Live count updates

2. **Session Updates**
   - Session created/updated/cancelled
   - Notify enrolled students

**Deliverables**: Real-time messaging, notifications, live updates working

---

## Phase 9: AI Assistant

### AI Integration
1. **AI Service**
   - Choose provider (OpenAI/Anthropic)
   - API client setup
   - Error handling
   - Rate limiting

2. **Context Management**
   - Fetch public teacher data
   - Fetch public classes
   - Fetch FAQs
   - Build context prompt

3. **Chat Widget**
   - Floating chat button
   - Chat window (expandable)
   - Message history
   - Typing indicator

4. **AI Safety**
   - Refuse private data requests
   - Show disclaimer
   - Provide contact CTAs
   - Log conversations (optional)

5. **Lead Capture Integration**
   - Detect enrollment intent
   - Show lead form
   - Create lead record
   - Notify teacher

### FAQ Management
1. **FAQ CRUD**
   - Teacher can add/edit FAQs
   - FAQs used in AI context
   - Display on public page (optional)

**Deliverables**: AI chat widget working, answers questions, captures leads

---

## Phase 10: Polish & Testing

### Testing
1. **Unit Tests**
   - Auth service tests
   - Core service tests
   - Utility function tests

2. **Integration Tests**
   - API endpoint tests
   - Database operations
   - Authentication flows

3. **E2E Tests** (optional)
   - Critical user flows
   - Teacher approval workflow
   - Student enrollment flow

### UI/UX Improvements
1. **Loading States**
   - Skeleton loaders
   - Spinner components
   - Progress indicators

2. **Empty States**
   - No classes message
   - No students message
   - No messages message

3. **Error Handling**
   - Error boundaries (React)
   - Error pages (404, 500)
   - Toast notifications for errors

4. **Responsive Design**
   - Mobile breakpoints
   - Tablet breakpoints
   - Desktop optimization
   - Touch-friendly interactions

5. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast

### Performance
1. **Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization
   - API response caching

2. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Analytics (optional)

**Deliverables**: Polished UI, tests passing, good performance

---

## Phase 11: Deployment Prep

### Dockerfiles
1. **API Dockerfile**
   - Multi-stage build
   - Node.js base image
   - Production dependencies only
   - Health check

2. **Frontend Dockerfiles**
   - Build React app
   - Serve with Nginx
   - Static file serving

### Docker Compose
1. **Production Compose**
   - MongoDB service
   - API service
   - Frontend services
   - Nginx reverse proxy (optional)
   - Volume mounts

### Seed Script
1. **Demo Data**
   - Create admin user
   - Create 2 teachers (1 approved, 1 pending)
   - Create 20 students
   - Create sample classes
   - Create sample sessions
   - Create sample lessons/materials

### Documentation
1. **README Updates**
   - Setup instructions
   - Environment variables
   - Deployment guides

2. **API Documentation**
   - Swagger/OpenAPI setup
   - Endpoint documentation
   - Request/response examples

### Environment Configuration
1. **Production .env.example**
   - All required variables
   - Comments explaining each
   - Default values where applicable

**Deliverables**: Production-ready deployment, seed script, complete documentation

---

## Timeline Estimate

- **Phase 1**: 2-3 days
- **Phase 2**: 3-4 days
- **Phase 3**: 5-7 days
- **Phase 4**: 4-5 days
- **Phase 5**: 6-8 days
- **Phase 6**: 4-5 days
- **Phase 7**: 3-4 days
- **Phase 8**: 3-4 days
- **Phase 9**: 4-5 days
- **Phase 10**: 5-7 days
- **Phase 11**: 2-3 days

**Total**: ~45-60 days (9-12 weeks) for a single developer

---

## Notes

- Phases can overlap (e.g., start Phase 5 while Phase 4 is being tested)
- Prioritize core features first (auth, classes, enrollment)
- Add polish features incrementally
- Test as you build, don't wait until Phase 10
- Get feedback early and often
