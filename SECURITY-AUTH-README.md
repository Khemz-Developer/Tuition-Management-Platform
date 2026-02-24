# Security & Authentication — Tuition Management System

This document describes how **login, authentication, and role-based access** work in the project and recommends best practices for implementation and hardening.

---

## 1. Roles Overview

| Role     | Value    | Access |
|----------|----------|--------|
| **Admin**   | `ADMIN`   | Full system: dashboard, teachers, students, classes, settings, audit logs, dynamic config. |
| **Teacher** | `TEACHER` | Teacher portal: dashboard, my classes, calendar, sessions, attendance, content, messages, leads, profile. |
| **Student** | `STUDENT` | Student portal: dashboard, classes, my classes, teachers, messages, profile. |

Roles are stored in the **User** model (MongoDB) and embedded in the **JWT payload** so the backend can enforce access without a DB lookup on every request.

---

## 2. Current Implementation Summary

### 2.1 Backend (NestJS)

| Component | Implementation |
|-----------|----------------|
| **Password storage** | bcrypt hash (10 rounds) before saving to DB. |
| **Login** | `POST /api/auth/login` with `email` + `password`. Returns `user` + `accessToken` + `refreshToken`. |
| **Registration** | `POST /api/auth/register` with DTO (email, password, role, firstName, lastName, optional teacherProfile/teacherId/teacherSlug). Password min length: 6. |
| **JWT access token** | Signed with `JWT_SECRET`, short-lived (e.g. 15m). Payload: `sub` (userId), `email`, `role`. |
| **JWT refresh token** | Signed with `JWT_REFRESH_SECRET`, longer-lived (e.g. 7d). Used to get new access token. |
| **Token refresh** | `POST /api/auth/refresh` with `refreshToken` in body. Returns new access + refresh tokens. |
| **Current user** | `GET /api/auth/me` requires `Authorization: Bearer <accessToken>`. Returns user id, email, role, name. |
| **Guards** | **JwtAuthGuard**: validates JWT and loads user; rejects if missing/invalid or user inactive/suspended. **RolesGuard**: allows only if `user.role` is in the `@Roles(...)` list. **PublicGuard**: can skip JWT when route is marked `@Public()`. |
| **Controllers** | Admin: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)`. Teacher/Student: same pattern with `TEACHER` / `STUDENT`. Auth: `@Public()` on register/login/refresh; `JwtAuthGuard` on `/me`. |
| **Validation** | Global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform). DTOs use class-validator (e.g. `LoginDto`, `RegisterDto`). |
| **Rate limiting** | ThrottlerModule: 100 requests per minute per IP (global). |
| **Account state** | Login and JWT validate reject if `user.isActive === false` or `user.isSuspended === true`. |

### 2.2 Frontend (React + Vite)

| Component | Implementation |
|-----------|----------------|
| **Token storage** | `accessToken` and `refreshToken` in **localStorage**. |
| **Auth context** | `AuthProvider` holds `user`, `isLoading`, `isAuthenticated`; provides `login`, `register`, `logout`, `refreshUser`. |
| **Login** | Calls `authService.login()` → saves tokens and user → redirects by role (Admin → `/admin/dashboard`, Teacher → `/teacher/dashboard`, Student → `/dashboard`). |
| **API client** | Axios: request interceptor adds `Authorization: Bearer <accessToken>`. On 401: tries refresh once, retries request; on refresh failure clears tokens and redirects to `/login`. |
| **Routes** | **ProtectedRoute**: requires `isAuthenticated`, else redirect to `/login`. **AdminRoute** / **TeacherRoute** / **StudentRoute**: require `user.role === 'ADMIN'|'TEACHER'|'STUDENT'`, else redirect to `/`. |
| **Logout** | Clears localStorage tokens and user; redirects to `/login`. Frontend may call `POST /auth/logout` (backend may not implement token invalidation yet). |

---

## 3. Security Analysis & Gaps

| Area | Current state | Risk / note |
|------|----------------|-------------|
| **Passwords** | bcrypt, min length 6 | Prefer min 8+ and complexity rules for production. |
| **Tokens in localStorage** | Access + refresh in localStorage | XSS can steal tokens. Prefer **httpOnly cookies** for refresh token and short-lived access token or session. |
| **Refresh token on logout** | No backend logout endpoint (or no blacklist) | Refresh token still valid until expiry. Prefer blacklist or refresh-token revocation on logout. |
| **Login rate limiting** | Global 100 req/min | Consider **stricter limit for /auth/login** (e.g. 5 per min per IP) to slow brute force. |
| **HTTPS** | Not enforced in code | Production must use HTTPS only. |
| **CORS** | Configured via `CORS_ORIGIN` | Ensure only trusted front-end origins; avoid `*` in production. |
| **JWT secrets** | Env vars `JWT_SECRET`, `JWT_REFRESH_SECRET` | Must be strong, random, and different from each other; never in code. |
| **Role on client** | Role in context from `/auth/me` | Backend must always enforce role; frontend role is UX only. |
| **AdminRoute loading** | No loading state | Brief flash of content before redirect; can add `isLoading` check. |

---

## 4. Recommended Best Practices

### 4.1 Backend

1. **Secrets & env**
   - Use strong, random `JWT_SECRET` and `JWT_REFRESH_SECRET` (e.g. 32+ bytes).
   - Keep `.env` out of version control; use env-specific config in production.

2. **Passwords**
   - Increase minimum length to **8** (or 12) and add complexity (e.g. upper, lower, number, symbol) in `RegisterDto` and any “change password” DTOs.
   - Keep bcrypt rounds at 10–12; consider 12 for high-security contexts.

3. **Login hardening**
   - Add **stricter rate limiting** for `POST /api/auth/login` (e.g. 5–10 requests per minute per IP).
   - Use **generic error message** (“Invalid credentials”) and avoid revealing whether email exists.

4. **Refresh token**
   - Prefer storing refresh tokens in DB (or cache) and **invalidating on logout** (delete or mark revoked).
   - Optionally rotate refresh token on each use and issue a new one.

5. **Logout**
   - Implement `POST /api/auth/logout` that accepts refresh token (or current access token) and **revokes/blacklists** it so it cannot be reused.

6. **Guards**
   - Keep **JwtAuthGuard + RolesGuard** on every protected controller; never rely on “public by default” without an explicit guard.
   - Use `@Public()` only for routes that must be unauthenticated (e.g. login, register, refresh, health).

7. **HTTPS**
   - In production, serve the API over **HTTPS only** and consider HSTS headers.

### 4.2 Frontend

1. **Tokens**
   - Prefer **httpOnly cookie** for refresh token (set by backend on login/refresh) and keep access token in memory or short-lived cookie to reduce XSS impact.
   - If keeping localStorage: minimize XSS surface (sanitize inputs, CSP, avoid `dangerouslySetInnerHTML` with user data).

2. **Redirect after login**
   - Use `redirect` query param (or saved location) so after login the user is sent to the intended page (e.g. `/teacher/classes`) instead of always dashboard, when safe.

3. **Role routes**
   - Keep **ProtectedRoute** then **AdminRoute** / **TeacherRoute** / **StudentRoute** so unauthenticated users go to login and wrong-role users get a clear redirect (e.g. `/` or “Access denied”).

4. **Logout**
   - Call backend logout when implemented (to invalidate refresh token) and always clear local tokens and user state.

5. **Error handling**
   - On 401 from `/auth/me` or after failed refresh, clear tokens and redirect to login without exposing internals.

### 4.3 DevOps / Deployment

- Use **HTTPS** and restrict **CORS** to known front-end origins.
- Run backend with **least privilege**; do not run as root.
- Prefer **secrets manager** (e.g. AWS Secrets Manager, HashiCorp Vault) for JWT secrets in production.
- **Log** authentication failures and suspicious activity (e.g. many 401s from same IP) for monitoring; avoid logging passwords or tokens.

---

## 5. Quick Reference — Auth Flows

### Login

1. User submits email + password → `POST /api/auth/login`.
2. Backend: find user by email, compare password with bcrypt, check `isActive` and not suspended.
3. Backend: issue access + refresh tokens, return user + tokens.
4. Frontend: store tokens in localStorage, set user in context, redirect by role.

### Authenticated API request

1. Frontend: Axios interceptor adds `Authorization: Bearer <accessToken>`.
2. Backend: JwtAuthGuard validates JWT, attaches user to request; RolesGuard checks `user.role`.
3. If 401: frontend tries refresh; on success retries request; on failure clears tokens and redirects to login.

### Role-based route access

- **Admin**: only `user.role === 'ADMIN'` can access routes under `AdminRoute` (e.g. `/admin/*`).
- **Teacher**: only `user.role === 'TEACHER'` can access routes under `TeacherRoute` (e.g. `/teacher/*`).
- **Student**: only `user.role === 'STUDENT'` can access routes under `StudentRoute` (e.g. `/student/*`).

Backend enforces the same roles with `@Roles(UserRole.ADMIN)` (or TEACHER/STUDENT) on the corresponding controllers.

---

## 6. File Reference

| Layer   | Purpose | Location |
|---------|---------|----------|
| Backend | Auth controller (login, register, refresh, me) | `Tuition-Management-System-BE/src/auth/auth.controller.ts` |
| Backend | Auth service (password hash, token generation) | `Tuition-Management-System-BE/src/auth/auth.service.ts` |
| Backend | JWT strategy (access token validation) | `Tuition-Management-System-BE/src/auth/strategies/jwt.strategy.ts` |
| Backend | Refresh token strategy | `Tuition-Management-System-BE/src/auth/strategies/jwt-refresh.strategy.ts` |
| Backend | JWT guard | `Tuition-Management-System-BE/src/guards/jwt-auth.guard.ts` |
| Backend | Roles guard | `Tuition-Management-System-BE/src/guards/roles.guard.ts` |
| Backend | Public decorator | `Tuition-Management-System-BE/src/decorators/public.decorator.ts` |
| Backend | Roles decorator | `Tuition-Management-System-BE/src/decorators/roles.decorator.ts` |
| Backend | User schema (roles, isActive, isSuspended) | `Tuition-Management-System-BE/src/models/user.schema.ts` |
| Frontend | Auth context & provider | `Tuition-Management-System-FE/src/shared/contexts/AuthContext.tsx` |
| Frontend | Auth API (login, register, refresh, me) | `Tuition-Management-System-FE/src/shared/services/auth.service.ts` |
| Frontend | API client (Bearer token, refresh on 401) | `Tuition-Management-System-FE/src/shared/services/api.ts` |
| Frontend | Protected route | `Tuition-Management-System-FE/src/routes/ProtectedRoute.tsx` |
| Frontend | Admin / Teacher / Student routes | `Tuition-Management-System-FE/src/routes/AdminRoute.tsx` etc. |
| Frontend | Login page | `Tuition-Management-System-FE/src/shared/pages/auth/Login.tsx` |

---

This README reflects the current security and auth design and gives a concise set of recommendations. Implementing the “Recommended Best Practices” will strengthen security for production use.
