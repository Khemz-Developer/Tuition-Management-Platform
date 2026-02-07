# Tuition Management System - Frontend

A modern, responsive web application for managing tuition services. Built with React, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui + DaisyUI
- **State Management**: @tanstack/react-query
- **Routing**: react-router-dom v6
- **Forms**: react-hook-form + zod
- **Real-time**: Socket.io-client
- **Charts**: Recharts
- **Calendar**: FullCalendar
- **Icons**: Lucide React

## Project Structure

```
src/
├── admin-teacher-web/          # Admin and Teacher portals
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   └── TeacherLayout.tsx
│   └── pages/
│       ├── admin/              # Admin pages
│       │   ├── Dashboard.tsx
│       │   ├── Teachers.tsx
│       │   ├── Students.tsx
│       │   ├── Classes.tsx
│       │   ├── Settings.tsx
│       │   └── AuditLogs.tsx
│       └── teacher/            # Teacher pages
│           ├── Dashboard.tsx
│           ├── Classes.tsx
│           ├── ClassDetail.tsx
│           ├── Sessions.tsx
│           ├── Attendance.tsx
│           ├── Content.tsx
│           ├── Messages.tsx
│           ├── Profile.tsx
│           ├── Leads.tsx
│           └── Website.tsx
├── student-web/                # Student portal
│   ├── layouts/
│   │   └── StudentLayout.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Classes.tsx
│   │   ├── ClassDetail.tsx
│   │   ├── MyClasses.tsx
│   │   ├── MyClassDetail.tsx
│   │   ├── Messages.tsx
│   │   ├── Profile.tsx
│   │   ├── Teachers.tsx
│   │   └── PublicTeacherProfile.tsx
│   └── components/
│       └── public-website/     # Public website components
│           ├── HeroSection.tsx
│           ├── AboutSection.tsx
│           ├── ClassesSection.tsx
│           ├── ScheduleSection.tsx
│           ├── TestimonialsSection.tsx
│           ├── FAQSection.tsx
│           ├── ContactSection.tsx
│           ├── AIChatWidget.tsx
│           └── PageRenderer.tsx
├── shared/                     # Shared modules
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── auth/               # Auth pages
│   │   └── guards/             # Route guards
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API services
│   └── types/                  # TypeScript types
├── lib/                        # Utilities
│   ├── queryClient.ts
│   ├── socket.ts
│   └── utils.ts
├── App.tsx                     # Main app with routing
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on port 3000

### Installation

1. Clone the repository:
```bash
cd Tuition-Management-System-FE
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

5. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Admin Portal (`/admin/*`)
- Dashboard with analytics and stats
- Teacher management (CRUD operations)
- Student management
- Class overview and management
- System settings
- Audit logs

### Teacher Portal (`/teacher/*`)
- Dashboard with class stats and schedule
- Class management with curriculum builder
- Session scheduling and management
- Attendance tracking
- Content/material upload
- Student messaging
- Lead management for new inquiries
- Public website builder

### Student Portal (`/student/*`)
- Dashboard with enrolled classes
- Browse available classes
- Class enrollment
- View sessions and materials
- Message teachers
- Profile management
- Find teachers

### Public Website
- Customizable landing pages
- AI chat widget for inquiries
- Class browsing
- Teacher profiles
- Contact forms

## API Integration

The application uses @tanstack/react-query for data fetching with the following patterns:

```typescript
// Query keys
import { queryKeys } from '@/lib/queryClient'

// Example query
const { data, isLoading } = useQuery({
  queryKey: queryKeys.classes.list({ page: 1 }),
  queryFn: () => classService.getAll({ page: 1 }),
})

// Example mutation
const mutation = useMutation({
  mutationFn: classService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.classes.all })
  },
})
```

## Authentication

JWT-based authentication with refresh tokens:

- Access token stored in memory
- Refresh token stored in httpOnly cookie
- Automatic token refresh on expiry
- Protected routes with role-based access

## Styling

Using TailwindCSS with:
- **shadcn/ui**: Primary component library
- **DaisyUI**: Additional components (prefixed with `daisy-`)
- **Dark mode**: Supported via ThemeContext

## Real-time Features

Socket.io integration for:
- Live notifications
- Real-time messaging
- Attendance updates

## Docker

Build and run with Docker:

```bash
# Build image
docker build -t tuition-fe .

# Run container
docker run -p 80:80 tuition-fe
```

Or use docker-compose from the root directory.


