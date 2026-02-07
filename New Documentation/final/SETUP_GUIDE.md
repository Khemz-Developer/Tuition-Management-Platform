# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm/yarn/pnpm installed
- [ ] MongoDB 6+ installed and running (or MongoDB Atlas account)
- [ ] Cloudinary account (for file storage)
- [ ] Git installed
- [ ] Docker & Docker Compose (optional, for containerized setup)

---

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd tuition-management-system
```

### 2. Install Dependencies

**Using npm:**
```bash
# Install root dependencies
npm install

# Install dependencies for each app
cd apps/api && npm install && cd ../..
cd apps/web && npm install && cd ../..
cd packages/shared && npm install && cd ../..
```

**Using pnpm (recommended for monorepo):**
```bash
pnpm install
```

**Using yarn:**
```bash
yarn install
```

### 3. Setup MongoDB

#### Option A: Local MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
- Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**Verify MongoDB is running:**
```bash
mongosh
# or
mongo
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Use connection string in `.env` file

### 4. Setup Cloudinary

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 5. Configure Environment Variables

#### Backend API (`apps/api/.env`)

Create `apps/api/.env` file:

**Note:** This is a NestJS application. The framework provides built-in support for environment variables and configuration management using `@nestjs/config`.

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tuition-management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tuition-management?retryWrites=true&w=majority

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS (comma-separated origins)
CORS_ORIGIN=http://localhost:5173

# Socket.io
SOCKET_IO_PORT=3001

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@tuition-management.com

# AI Assistant (Optional - for public teacher chat)
# Choose one:
OPENAI_API_KEY=your-openai-api-key
# OR
ANTHROPIC_API_KEY=your-anthropic-api-key

# File Upload Limits
MAX_IMAGE_SIZE=5242880      # 5MB in bytes
MAX_DOCUMENT_SIZE=10485760  # 10MB in bytes
MAX_VIDEO_SIZE=104857600     # 100MB in bytes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000  # 1 minute
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (`apps/web/.env`)

Create `apps/web/.env` file:

> **Note:** The frontend uses a single application architecture with separate folders for admin-teacher-web and student-web within `apps/web/src/`.

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=Tuition Management Platform
VITE_PUBLIC_URL=http://localhost:5173
```

### 6. Generate JWT Secrets

**On Linux/macOS:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Or use Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use as `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` files.

### 7. Seed Database (Optional)

Run the seed script to create demo data:

```bash
cd apps/api
npm run seed
```

This will create:
- 1 Super Admin user (admin@example.com / password123)
- 2 Teachers (1 approved, 1 pending)
- 20 Students
- Sample classes, sessions, lessons, materials

### 8. Start Development Servers

#### Option A: Manual Start (Recommended for development)

**Terminal 1 - Backend API (NestJS):**
```bash
cd apps/api
npm run start:dev
# API runs on http://localhost:3000
# NestJS will watch for file changes and auto-reload
```

**Terminal 2 - Frontend (Single app serves both portals):**
```bash
cd apps/web
npm run dev
# Runs on http://localhost:5173
# Admin/Teacher Portal: http://localhost:5173/admin or /teacher
# Student Portal: http://localhost:5173/student
# Public Teacher Pages: http://localhost:5173/t/{teacher-slug}
# Teacher Directory: http://localhost:5173/teachers
```

#### Option B: Docker Compose (For containerized setup)

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: tuition-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    networks:
      - tuition-network

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    container_name: tuition-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/tuition-management
    depends_on:
      - mongodb
    volumes:
      - ./apps/api:/app
      - /app/node_modules
    networks:
      - tuition-network

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: tuition-web
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=development
    depends_on:
      - api
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    networks:
      - tuition-network

volumes:
  mongodb_data:

networks:
  tuition-network:
    driver: bridge
```

Then run:
```bash
docker-compose up
```

### 9. Verify Installation

1. **Check API Health (NestJS):**
   ```bash
   curl http://localhost:3000/api/health
   # Should return: {"status": "ok"}
   # NestJS provides built-in health check endpoints
   ```

2. **Access Admin Portal:**
   - Open http://localhost:5173/admin
   - Login with: admin@example.com / password123

3. **Access Student Portal:**
   - Open http://localhost:5173/student
   - Register a new student or login with: student@example.com / password123

4. **Access Teacher Directory:**
   - Open http://localhost:5173/teachers
   - Browse approved teachers

5. **Access Public Teacher Page:**
   - Open http://localhost:5173/t/{teacher-slug}
   - View teacher's customizable public profile

6. **Check MongoDB:**
   ```bash
   mongosh tuition-management
   # or
   mongo tuition-management
   ```
   ```javascript
   show collections
   db.users.countDocuments()
   ```

---

## Troubleshooting

### MongoDB Connection Issues

**Error: `MongoServerError: Authentication failed`**

- Check MongoDB credentials in `.env`
- For local MongoDB, ensure authentication is disabled or credentials are correct
- For MongoDB Atlas, check IP whitelist and connection string

**Error: `MongooseServerSelectionError: connect ECONNREFUSED`**

- Ensure MongoDB is running: `mongosh` or check service status
- Verify `MONGODB_URI` in `.env` is correct
- Check if MongoDB is listening on port 27017

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::3000`**

- Find and kill the process:
  ```bash
  # Linux/macOS
  lsof -ti:3000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change port in `.env` file

### CORS Errors

- Ensure `CORS_ORIGIN` in `apps/api/.env` includes your frontend URLs
- Check that frontend `.env` files have correct `VITE_API_URL`

### Cloudinary Upload Fails

- Verify Cloudinary credentials in `.env`
- Check file size limits (default: 5MB images, 10MB PDFs, 100MB videos)
- Ensure Cloudinary account is active

### JWT Token Errors

- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and at least 32 characters
- Check token expiry times (`JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`)
- Ensure tokens are being sent in Authorization header: `Bearer <token>`

### Module Not Found Errors

- Run `npm install` in each app directory
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Build Errors

- Check Node.js version: `node --version` (should be 18+)
- Clear build cache:
  ```bash
  rm -rf .next dist build
  ```
- Check TypeScript errors: `npm run type-check`

---

## Development Workflow

### Running Tests

```bash
# Backend tests
cd apps/api
npm test

# Frontend tests
cd apps/web
npm test
```

### Code Formatting

```bash
# Format all code
npm run format

# Lint all code
npm run lint
```

### Database Migrations

Currently using Mongoose, migrations are handled automatically. For production:

1. Backup database before schema changes
2. Test changes in development first
3. Use transactions for multi-document operations

---

## Production Deployment

### Environment Variables

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets (32+ characters)
3. Use MongoDB Atlas or managed MongoDB service
4. Configure proper CORS origins
5. Set up SSL/TLS certificates
6. Configure email service (SendGrid, AWS SES, etc.)
7. Set up monitoring (Sentry, New Relic, etc.)

### Build Commands

**Backend:**
```bash
cd apps/api
npm run build
npm start
```

**Frontend:**
```bash
cd apps/web
npm run build
# Serve dist/ folder with Nginx or similar
```

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Next Steps

1. ✅ Complete setup
2. ✅ Verify all services are running
3. ✅ Login and explore the platform
4. ✅ Review API documentation at `/api/docs` (if Swagger is set up)
5. ✅ Customize branding and settings
6. ✅ Add your first teacher and class
7. ✅ Test enrollment workflow
8. ✅ Configure email notifications
9. ✅ Set up AI assistant (if using)
10. ✅ Deploy to production

---

## Getting Help

- Check [README.md](./README.md) for overview
- Review [API_ROUTES.md](./API_ROUTES.md) for API documentation
- See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database structure
- Review [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md) for development phases

---

## Quick Reference

### Default Demo Accounts

After running seed script:

- **Super Admin**: admin@example.com / password123
- **Teacher 1**: teacher1@example.com / password123 (Approved)
- **Teacher 2**: teacher2@example.com / password123 (Pending)
- **Student**: student@example.com / password123

### Important URLs

- Admin Portal: http://localhost:5173/admin
- Teacher Portal: http://localhost:5173/teacher
- Student Portal: http://localhost:5173/student
- Teacher Directory: http://localhost:5173/teachers
- API: http://localhost:3000/api
- Public Teacher Page: http://localhost:5173/t/{teacher-slug}
- MongoDB: mongodb://localhost:27017

### Useful Commands

```bash
# Start all services (if using concurrently)
npm run dev

# Seed database
cd apps/api && npm run seed

# Reset database (WARNING: deletes all data)
cd apps/api && npm run db:reset

# Check MongoDB connection
mongosh tuition-management

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

**Last Updated**: [Current Date]
