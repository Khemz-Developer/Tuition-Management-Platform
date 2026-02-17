# Frontend Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

## Installation

1. Install dependencies from the root:
```bash
npm install
```

This will install dependencies for all workspaces (admin-teacher-web, student-web, and shared).

## Development

### Run Admin-Teacher Web App
```bash
npm run dev:admin
```
App will be available at `http://localhost:5173`

### Run Student Web App
```bash
npm run dev:student
```
App will be available at `http://localhost:5174`

## Environment Variables

Create `.env` files in each app directory:

### `apps/admin-teacher-web/.env`
```
VITE_API_URL=http://localhost:3000/api
```

### `apps/student-web/.env`
```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
Tuition-Management-System-FE/
├── apps/
│   ├── admin-teacher-web/    # Admin + Teacher Portal
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── contexts/      # React contexts (Auth)
│   │   │   ├── pages/         # Route pages
│   │   │   └── ...
│   │   └── package.json
│   └── student-web/           # Student Portal
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/               # Shared types, API client, utilities
│       ├── src/
│       │   ├── types/         # TypeScript types
│       │   ├── api/           # API client
│       │   └── utils/         # Utility functions
│       └── package.json
└── package.json               # Root workspace config
```

## Features Implemented

### ✅ Basic Structure
- Monorepo setup with workspaces
- Shared package for types and API client
- TailwindCSS + DaisyUI configuration
- React Router setup
- Authentication context and protected routes

### ✅ Admin-Teacher Web
- Login/Register pages
- Protected routes for ADMIN and TEACHER roles
- Dashboard layouts with sidebar navigation
- Basic dashboard pages

### ✅ Student Web
- Login/Register pages
- Protected routes for STUDENT role
- Dashboard layout with sidebar
- Basic dashboard page

### ✅ Shared Package
- TypeScript types for all entities
- API client with automatic token refresh
- Utility functions (date formatting, validation, etc.)

## Next Steps

1. **Install additional dependencies** (when needed):
   - shadcn/ui components
   - FullCalendar for calendar views
   - Recharts for analytics charts
   - Socket.io client for real-time features

2. **Implement Features**:
   - Class management pages
   - Session scheduling
   - Attendance tracking
   - Content management
   - Messaging system
   - Analytics dashboards

3. **Add UI Components**:
   - Form components
   - Table components
   - Modal/Dialog components
   - Toast notifications

## Building for Production

```bash
# Build all apps
npm run build

# Build specific app
npm run build:admin
npm run build:student
```

Build outputs will be in `apps/{app-name}/dist/`
