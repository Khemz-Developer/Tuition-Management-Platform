# Frontend Architecture Documentation

## Overview

The frontend consists of **two separate React applications** running independently, sharing common code through a monorepo workspace structure.

---

## 🏗️ Architecture Structure

### Two Separate React Apps

```
Tuition-Management-System-FE/
├── apps/
│   ├── admin-teacher-web/    # React App 1: Port 5173
│   │   └── For ADMIN and TEACHER users
│   │
│   └── student-web/          # React App 2: Port 5174
│       └── For STUDENT users
│
└── packages/
    └── shared/               # Shared code (types, API client)
```

### Why Two Separate Apps?

1. **Different User Roles**: Admin/Teacher and Students have completely different interfaces and features
2. **Different Ports**: Each app runs on its own port for independent development
3. **Code Separation**: Keeps the codebase organized and maintainable
4. **Independent Deployment**: Can be deployed separately if needed

---

## 🚀 How to Run the Applications

### Development Mode

#### Option 1: Run Both Apps Simultaneously

Open **two separate terminal windows**:

**Terminal 1 - Admin/Teacher App:**
```bash
cd Tuition-Management-System-FE
npm run dev:admin
```
- Runs on: `http://localhost:5173`
- For ADMIN and TEACHER users

**Terminal 2 - Student App:**
```bash
cd Tuition-Management-System-FE
npm run dev:student
```
- Runs on: `http://localhost:5174`
- For STUDENT users

#### Option 2: Run One at a Time

```bash
# Run admin-teacher app
npm run dev:admin

# OR run student app
npm run dev:student
```

### Production Build

```bash
# Build both apps
npm run build

# Build specific app
npm run build:admin
npm run build:student
```

---

## 🐳 Docker Container Setup

### Backend Container

The backend runs in a Docker container (not the frontend):

```yaml
# docker-compose.yml (in Tuition-Management-System-BE/)
services:
  api:
    container_name: tuition-api
    ports:
      - "3000:3000"  # Backend API
```

**To run the backend container:**
```bash
cd Tuition-Management-System-BE
docker-compose up
```

### Frontend Development

**The frontend apps run directly on your machine (not in containers)** during development:
- Admin/Teacher App: `http://localhost:5173`
- Student App: `http://localhost:5174`
- Backend API: `http://localhost:3000` (from Docker container)

### How They Connect

```
┌─────────────────────────────────────────┐
│  Frontend Apps (Your Machine)          │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Admin/Teacher│  │   Student    │    │
│  │  Port 5173   │  │  Port 5174   │    │
│  └──────┬───────┘  └──────┬───────┘    │
│         │                 │             │
│         └────────┬────────┘             │
│                  │                      │
│         API Calls via Axios            │
└──────────────────┼─────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Docker Container│
         │  Backend API     │
         │  Port 3000       │
         └──────────────────┘
```

---

## 🔐 Authentication Flow (Login & Register)

### How Login Works

#### 1. **User Visits Login Page**
   - URL: `http://localhost:5173/login` (Admin/Teacher) or `http://localhost:5174/login` (Student)
   - Component: `pages/auth/Login.tsx`

#### 2. **User Submits Credentials**
   ```typescript
   // User enters email and password
   // Form submits to handleSubmit()
   ```

#### 3. **API Call to Backend**
   ```typescript
   // AuthContext calls apiClient.login()
   // POST request to: http://localhost:3000/api/auth/login
   // Body: { email, password }
   ```

#### 4. **Backend Response**
   ```json
   {
     "accessToken": "jwt_token_here",
     "refreshToken": "refresh_token_here",
     "user": {
       "id": "...",
       "email": "...",
       "role": "ADMIN" | "TEACHER" | "STUDENT"
     }
   }
   ```

#### 5. **Tokens Stored**
   - `accessToken` → `localStorage.setItem('accessToken', ...)`
   - `refreshToken` → `localStorage.setItem('refreshToken', ...)`
   - User data → Stored in React Context (`AuthContext`)

#### 6. **Redirect Based on Role**
   - **ADMIN** → `/admin/dashboard`
   - **TEACHER** → `/teacher/dashboard`
   - **STUDENT** → `/dashboard`

### How Register Works

#### 1. **User Visits Register Page**
   - URL: `http://localhost:5173/register` or `http://localhost:5174/register`
   - Component: `pages/auth/Register.tsx`

#### 2. **User Fills Form**
   - First Name, Last Name, Email, Password
   - Role selection (STUDENT or TEACHER - ADMIN cannot register)

#### 3. **API Call**
   ```typescript
   // POST to: http://localhost:3000/api/auth/register
   // Body: { firstName, lastName, email, password, role }
   ```

#### 4. **After Registration**
   - Tokens are stored automatically
   - User is redirected to `/login` page
   - User must login to access protected pages

### Authentication Context Flow

```typescript
// AuthContext.tsx manages authentication state
AuthProvider
  ├── Checks localStorage for existing tokens on mount
  ├── Validates token with backend (/auth/me)
  ├── Provides login(), register(), logout() functions
  └── Manages user state and authentication status
```

### Protected Routes

```typescript
// ProtectedRoute.tsx checks:
1. Is user authenticated? → Redirect to /login if not
2. Does user have required role? → Redirect to /login if not
3. Show loading spinner while checking
4. Render children if authenticated and authorized
```

---

## 📄 How to Access Different Pages

### Admin-Teacher Web App (Port 5173)

#### Public Routes (No Auth Required)
- `/login` - Login page
- `/register` - Registration page

#### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/teachers` - Manage teachers

#### Protected Teacher Routes
- `/teacher/dashboard` - Teacher dashboard
- `/teacher/classes` - Manage classes

#### Navigation Flow
```
Login → Check Role → Redirect:
  - ADMIN → /admin/dashboard
  - TEACHER → /teacher/dashboard
```

### Student Web App (Port 5174)

#### Public Routes
- `/login` - Student login
- `/register` - Student registration

#### Protected Student Routes
- `/dashboard` - Student dashboard
- `/classes` - Browse and enroll in classes
- `/calendar` - View class schedule
- `/messages` - Messages with teachers

#### Navigation Flow
```
Login → Check Role → Redirect:
  - STUDENT → /dashboard
```

---

## 🔄 Complete User Journey Example

### Example: Admin User Login

1. **Open Browser**: `http://localhost:5173`
2. **Auto-redirect**: `/` → `/login` (if not authenticated)
3. **Enter Credentials**: Email and password
4. **Submit**: Form calls `login()` function
5. **API Request**: `POST /api/auth/login`
6. **Response**: Receives tokens and user data
7. **Storage**: Tokens saved to localStorage
8. **Check Role**: User role is "ADMIN"
9. **Redirect**: Navigate to `/admin/dashboard`
10. **Protected Route**: `ProtectedRoute` checks authentication
11. **Render**: Admin dashboard is displayed

### Example: Student Registration

1. **Open Browser**: `http://localhost:5174/register`
2. **Fill Form**: Enter name, email, password, select "STUDENT"
3. **Submit**: Form calls `register()` function
4. **API Request**: `POST /api/auth/register`
5. **Response**: Account created, tokens received
6. **Redirect**: Navigate to `/login`
7. **Login**: User logs in with new credentials
8. **Redirect**: Navigate to `/dashboard` (student dashboard)

---

## 🛠️ Technical Details

### Shared Package

Both apps share:
- **Types**: `@shared/types` - TypeScript interfaces
- **API Client**: `@shared/api` - Axios instance with token management
- **Utilities**: Common helper functions

### API Client Features

```typescript
apiClient
  ├── Automatic token injection (Bearer token in headers)
  ├── Token refresh on 401 errors
  ├── Automatic logout on refresh failure
  └── Centralized error handling
```

### Environment Variables

Create `.env` files in each app:

**apps/admin-teacher-web/.env:**
```
VITE_API_URL=http://localhost:3000/api
```

**apps/student-web/.env:**
```
VITE_API_URL=http://localhost:3000/api
```

---

## 📋 Quick Reference

### URLs

| App | Port | Login | Register | Dashboard |
|-----|------|-------|----------|-----------|
| Admin/Teacher | 5173 | `/login` | `/register` | `/admin/dashboard` or `/teacher/dashboard` |
| Student | 5174 | `/login` | `/register` | `/dashboard` |

### Commands

```bash
# Install dependencies
npm install

# Run admin-teacher app
npm run dev:admin

# Run student app
npm run dev:student

# Build all apps
npm run build
```

### File Structure

```
apps/admin-teacher-web/src/
├── App.tsx              # Main router configuration
├── main.tsx             # React entry point
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── admin/
│   │   └── Dashboard.tsx
│   └── teacher/
│       └── Dashboard.tsx
└── components/
    └── auth/
        └── ProtectedRoute.tsx  # Route protection
```

---

## 🐛 Troubleshooting

### App Not Loading?
1. Check if backend is running: `http://localhost:3000`
2. Check if correct port is being used (5173 or 5174)
3. Check browser console for errors

### Login Not Working?
1. Verify backend API is accessible
2. Check network tab for API requests
3. Verify CORS settings in backend
4. Check localStorage for tokens

### Can't Access Protected Pages?
1. Ensure you're logged in (check localStorage)
2. Verify your user role matches the route requirements
3. Check browser console for redirect messages

---

## 📚 Additional Resources

- **Backend API**: `http://localhost:3000/api`
- **API Documentation**: See `New Documentation/final/API_ROUTES.md`
- **Setup Guide**: See `SETUP.md` in each directory
