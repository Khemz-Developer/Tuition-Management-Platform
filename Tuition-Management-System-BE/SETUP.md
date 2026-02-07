# Backend Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (connection string already configured in .env)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The `.env` file is already configured with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://Jalitha:vhNAZBUStm70mpc2@tuition.bnntx8k.mongodb.net/tuition-management?retryWrites=true&w=majority
   ```

   **Important:** Update the following in `.env`:
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `JWT_SECRET` - Change to a strong random string (32+ characters)
   - `JWT_REFRESH_SECRET` - Change to a strong random string (32+ characters)

3. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user: `admin@example.com` / `admin123`
   - Teacher: `teacher1@example.com` / `teacher123`
   - 5 Students: `student1@example.com` to `student5@example.com` / `student123`

## Running the Application

**Development Mode:**
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/api`

## Project Structure

```
src/
├── auth/              # Authentication (register, login, refresh)
├── admin/             # Admin endpoints
├── teacher/           # Teacher endpoints
├── student/           # Student endpoints
├── public/            # Public endpoints (teacher pages)
├── upload/            # File upload endpoints
├── messaging/         # Messaging module
├── notifications/     # Notifications module
├── models/            # Mongoose schemas
├── guards/            # Auth guards
├── decorators/        # Custom decorators
├── interceptors/      # Request/response interceptors
├── filters/           # Exception filters
└── utils/            # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Admin (Requires ADMIN role)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/teachers` - List teachers
- `POST /api/admin/teachers/:id/approve` - Approve teacher
- `POST /api/admin/teachers/:id/reject` - Reject teacher
- `GET /api/admin/students` - List students
- `GET /api/admin/classes` - List all classes

### Teacher (Requires TEACHER role)
- `GET /api/teacher/dashboard` - Teacher dashboard
- `GET /api/teacher/profile` - Get profile
- `PUT /api/teacher/profile` - Update profile
- `GET /api/teacher/classes` - List classes
- `POST /api/teacher/classes` - Create class
- `GET /api/teacher/website/config` - Get website config
- `PUT /api/teacher/website/config` - Update website config

### Student (Requires STUDENT role)
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/classes` - Browse classes
- `POST /api/student/classes/:id/enroll` - Request enrollment

### Public (No authentication required)
- `GET /api/public/teachers` - List public teachers
- `GET /api/public/teachers/:slug` - Get public teacher profile
- `POST /api/public/teachers/:slug/contact` - Contact teacher (lead capture)

## Next Steps

1. **Complete Implementation**: The modules are created with basic structure. You need to:
   - Complete all service methods with full business logic
   - Add all missing endpoints from API_ROUTES.md
   - Implement file upload with Cloudinary
   - Add Socket.io for real-time messaging
   - Complete website configuration endpoints

2. **Testing**: Add unit and integration tests

3. **Documentation**: API documentation is in the documentation folder

## Notes

- All endpoints use JWT authentication except public endpoints
- Role-based access control is implemented using guards
- MongoDB connection is configured to use your Atlas cluster
- The project follows NestJS best practices with modules, services, and DTOs
