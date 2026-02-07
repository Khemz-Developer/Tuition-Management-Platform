# Tuition Management System - Backend API

NestJS backend API for the Tuition Management Platform.

## Features

- Authentication with JWT (access + refresh tokens)
- Role-based access control (Admin, Teacher, Student)
- Teacher application and approval workflow
- Class management and enrollment
- Session scheduling and attendance tracking
- Content management (Units, Lessons, Materials)
- Real-time messaging with Socket.io
- Public teacher websites with customization
- File uploads with Cloudinary
- Analytics and reporting

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Validation**: Zod + class-validator

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Database Seeding

```bash
npm run seed
```

## API Documentation

See the API_ROUTES.md file in the documentation folder for complete API documentation.

## Project Structure

```
src/
├── auth/              # Authentication module
├── admin/             # Admin endpoints
├── teacher/           # Teacher endpoints
├── student/           # Student endpoints
├── public/            # Public endpoints
├── upload/            # File upload endpoints
├── messaging/         # Messaging module
├── notifications/     # Notifications module
├── models/            # Mongoose models
├── config/            # Configuration
├── guards/            # Auth guards
├── decorators/        # Custom decorators
├── interceptors/      # Request/response interceptors
├── filters/           # Exception filters
├── pipes/             # Validation pipes
└── utils/             # Utility functions
```
