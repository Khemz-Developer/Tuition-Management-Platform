# Tuition Management System — Authentication

This document describes how authentication is implemented in both the **Backend** (NestJS) and **Frontend** (React) and includes suggestions for improvement.

---

## Table of Contents

1. [Overview](#overview)
2. [Backend Authentication](#backend-authentication)
3. [Frontend Authentication](#frontend-authentication)
4. [End-to-End Flow](#end-to-end-flow)
5. [Environment & Security](#environment--security)
6. [Suggestions & Improvements](#suggestions--improvements)

---

## Overview

| Aspect | Implementation |
|--------|----------------|
| **Strategy** | JWT access tokens + refresh tokens (stored in DB, sent via httpOnly cookie) |
| **Access token** | Short-lived (e.g. 15m), stored in memory on frontend, sent as `Authorization: Bearer <token>` |
| **Refresh token** | Long-lived (e.g. 7d), httpOnly cookie (path: `/api/auth`), stored in MongoDB with rotation |
| **Roles** | `ADMIN`, `TEACHER`, `STUDENT` — enforced by guards and route wrappers |

---

## Backend Authentication

### Stack

- **NestJS** with Passport (JWT + optional JWT-refresh strategies)
- **MongoDB** for users and refresh tokens
- **bcrypt** (12 rounds) for password hashing
- **class-validator** for DTOs
- **@nestjs/throttler** for rate limiting on auth endpoints

### Key Files

| File | Purpose |
|------|--------|
| `src/auth/auth.module.ts` | Registers JWT module, Passport strategies, User/RefreshToken models |
| `src/auth/auth.service.ts` | Register, login, refresh, logout, change-password, getCurrentUser |
| `src/auth/auth.controller.ts` | REST endpoints; sets/clears refresh cookie |
| `src/auth/strategies/jwt.strategy.ts` | Validates access JWT, loads user, attaches to `request.user` |
| `src/auth/strategies/jwt-refresh.strategy.ts` | For refresh JWT (optional; refresh is validated in service) |
| `src/guards/jwt-auth.guard.ts` | Requires valid JWT (used via `PublicGuard`) |
| `src/guards/public.guard.ts` | Skips JWT when route is marked `@Public()` |
| `src/guards/roles.guard.ts` | Restricts access by `@Roles(...)` |
| `src/models/refresh-token.schema.ts` | Stores refresh tokens with revocation and rotation |

### Auth Endpoints

| Method | Path | Auth | Rate limit | Description |
|--------|------|------|------------|-------------|
| POST | `/api/auth/register` | Public | 5/min | Register; returns user + accessToken; sets refresh cookie |
| POST | `/api/auth/login` | Public | 5/min | Login; returns user + accessToken; sets refresh cookie |
| POST | `/api/auth/refresh` | Public | 10/min | Body optional; reads refresh from cookie or body; returns new accessToken; sets new refresh cookie |
| POST | `/api/auth/logout` | Public | — | Reads refresh from cookie or body; revokes token; clears cookie |
| GET | `/api/auth/me` | JWT | — | Returns current user |
| POST | `/api/auth/change-password` | JWT | 3/min | Change password; revokes all refresh tokens for user |

### Behaviour

- **Register**: Validates email/role/profile; hashes password (bcrypt 12); creates User + role profile (Teacher/Student); issues tokens and sets refresh cookie.
- **Login**: Generic “Invalid credentials” for wrong email/password or inactive/suspended; updates `lastLoginAt`; issues tokens and sets refresh cookie.
- **Refresh**: Verifies refresh JWT with `JWT_REFRESH_SECRET`; ensures token exists in DB and is not revoked; on reuse, revokes all user tokens (rotation); issues new access + refresh and sets new cookie.
- **Logout**: Revokes refresh token in DB and clears `refreshToken` cookie (path/options match set-cookie).
- **Change password**: Validates current password; hashes new password; revokes all refresh tokens so user must log in again.

### Guards and Decorators

- **Global**: `PublicGuard` (JWT with skip when `@Public()`), then `RolesGuard` (checks `@Roles()`).
- **@Public()**: Used on register, login, refresh, logout so they don’t require JWT.
- **@Roles(UserRole.ADMIN | TEACHER | STUDENT)**: Applied on admin/teacher/student controllers.
- **@CurrentUser()**: Injects `request.user` (e.g. in change-password and `/auth/me`).

### Response Shape

All responses go through `TransformInterceptor`: `{ success: true, data: <payload> }`.  
Auth payloads:

- Login/Register: `{ user: { _id, email, role, name }, tokens: { accessToken } }`
- Refresh: `{ accessToken }`
- Me: `{ _id, email, role, name }`

---

## Frontend Authentication

### Stack

- **React** with React Router
- **Axios** with interceptors for Bearer token and refresh-on-401
- **Context**: `AuthContext` for user state and auth actions

### Key Files

| File | Purpose |
|------|--------|
| `src/shared/contexts/AuthContext.tsx` | Holds `user`, `isLoading`, `isAuthenticated`; provides login, register, logout, refreshUser |
| `src/shared/services/auth.service.ts` | API calls: login, register, logout, refresh, getCurrentUser, changePassword (+ stubs for forgot/reset/verify) |
| `src/shared/services/api.ts` | Axios instance, `withCredentials: true`, in-memory access token, request interceptor (Bearer), response interceptor (refresh on 401) |
| `src/shared/hooks/useAuth.ts` | Consumes `AuthContext` |
| `src/routes/AdminRoute.tsx`, `TeacherRoute.tsx`, `StudentRoute.tsx` | Role-based route wrappers; redirect to login or role dashboard |

### Token Handling

- **Access token**: Stored in module-level variable in `api.ts`; set after login/register/refresh; sent as `Authorization: Bearer <token>`.
- **Refresh token**: Not read in JS; sent automatically via httpOnly cookie with `withCredentials: true` (e.g. to `/api/auth/refresh` and `/api/auth/logout`).

### Auth Flows

1. **Initial load**: `AuthProvider` runs `refreshUser()` once. If no access token, it calls `authService.refreshToken()` (cookie sent), then `getCurrentUser()`, and sets user or clears state.
2. **Login**: Call login API → save access token → set user → redirect to saved path (if safe) or role dashboard.
3. **Register**: Call register API → save access token → set user → redirect to role dashboard.
4. **Logout**: Call logout API (cookie sent) → clear in-memory token → clear user → redirect to `/login`.
5. **401 handling**: Response interceptor calls `POST /api/auth/refresh` with credentials; on success, saves new access token and retries the failed request; on failure, clears token and redirects to `/login?redirect=...`.

### Route Protection

- **AdminRoute**: Requires user; if role ≠ ADMIN, redirect to teacher or student dashboard.
- **TeacherRoute**: Requires user; if role ≠ TEACHER, redirect to admin or student dashboard.
- **StudentRoute**: Requires user; if role ≠ STUDENT, redirect to admin or teacher dashboard.
- Redirects use safe-path checks (same-origin, no `javascript:`/`data:`).

---

## End-to-End Flow

```
1. User opens app
   → AuthContext runs refreshUser()
   → If no access token: POST /api/auth/refresh (cookie) → get accessToken → GET /api/auth/me
   → User set or cleared

2. User logs in
   → POST /api/auth/login
   → Backend sets refreshToken cookie, returns { user, tokens: { accessToken } }
   → Frontend stores accessToken in memory, sets user, redirects

3. User requests protected API
   → Axios adds Authorization: Bearer <accessToken>
   → If 401: POST /api/auth/refresh (cookie) → new accessToken → retry request
   → If refresh fails: clear token, redirect to /login

4. User logs out
   → POST /api/auth/logout (cookie)
   → Backend revokes token, clears cookie
   → Frontend clears token and user, redirects to /login
```

---

## Environment & Security

### Backend (.env)

- `JWT_SECRET`, `JWT_REFRESH_SECRET`: Strong, different, random (e.g. 64 hex chars).
- `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`: e.g. `15m`, `7d`.
- `CORS_ORIGIN`: Comma-separated frontend origins; must match the app URL(s) for cookie to work.
- Cookie: `httpOnly`, `secure` in production, `sameSite: 'none'` in production (cross-origin), path `/api/auth`.

### Frontend

- `VITE_API_URL`: Backend base URL (e.g. `http://localhost:3000/api`). Must be same-origin or CORS + credentials allowed for cookies.

### Security practices in place

- Passwords hashed with bcrypt (12 rounds).
- Generic “Invalid credentials” on login to avoid user enumeration.
- Refresh tokens stored in DB with revocation and rotation; reuse revokes all user tokens.
- Rate limiting on register, login, refresh, change-password.
- Helmet and CORS configured in backend.
- Redirect path validated on frontend to avoid open redirects.

---

## Suggestions & Improvements

### 1. Align frontend auth service with backend

The frontend `auth.service.ts` exposes:

- `forgotPassword`, `resetPassword`, `verifyEmail`, `resendVerification`

The backend does not implement these. Either:

- **Implement** them on the backend (e.g. magic link or token-based reset, email verification), or  
- **Remove** these methods (or mark as “coming soon”) so the API surface matches.

### 2. Forgot password & reset password

- Add `POST /api/auth/forgot-password` (email) → send reset link/token (e.g. by email).
- Add `POST /api/auth/reset-password` (token, newPassword) → validate token, set password, revoke refresh tokens.
- Use short-lived, single-use tokens stored in DB or signed JWT.

### 3. Email verification (optional)

- After register, mark user as unverified; optional guard or middleware that blocks sensitive actions until verified.
- Endpoints: verify (token), resend verification email; store verification token and expiry.

### 4. Refresh response shape and frontend

Backend refresh returns `{ accessToken }` inside `data`. Frontend uses `response.data.data` (correct for current interceptor). Document this in the frontend (e.g. in `api.ts` or a small auth doc) so future changes to the API shape don’t break refresh.

### 5. Session / device list (optional)

- Store optional `userAgent` / `ipAddress` (or device id) on refresh tokens (schema already has optional fields).
- Add `GET /api/auth/sessions` (and optionally “revoke other sessions”) for user visibility and security.

### 6. Stricter rate limiting for sensitive actions

- Keep or tighten limits on login/register (e.g. per-IP and optionally per-email after N failures).
- Consider temporary lockout or CAPTCHA after repeated failed logins.

### 7. Logout request body

- Backend accepts refresh token from cookie or body. For consistency and to support clients that don’t use cookies, you could document that logout always accepts `{ refreshToken?: string }` and prefer cookie when both exist.

### 8. Frontend: persist redirect after refresh failure

- You already redirect to `/login?redirect=...` on refresh failure. Ensure the login page uses this query when redirecting after successful login (your current logic already uses `redirectParam` and `isSafeRedirect`).

### 9. HTTPS and cookies in production

- Ensure frontend is served over HTTPS and `CORS_ORIGIN` uses `https://` so the refresh cookie can use `secure: true` and `sameSite: 'none'` safely.

### 10. Optional: CSRF for cookie-based refresh

- If you later add state-changing operations that rely on cookies (beyond refresh/logout), consider a CSRF token or SameSite plus strict origin checks for the auth API.

---

## Quick Reference

### Backend auth endpoints (base path: `/api/auth`)

- `POST /register` — body: RegisterDto  
- `POST /login` — body: LoginDto  
- `POST /refresh` — cookie or body: `{ refreshToken? }`  
- `POST /logout` — cookie or body: `{ refreshToken? }`  
- `GET /me` — header: `Authorization: Bearer <accessToken>`  
- `POST /change-password` — header: Bearer; body: `{ currentPassword, newPassword }`

### Frontend

- Access token: in-memory only; sent as Bearer.
- Refresh token: httpOnly cookie; sent automatically with `withCredentials: true`.
- Role dashboards: `/admin/dashboard`, `/teacher/dashboard`, `/student/dashboard`.

---

*Last updated to reflect current backend and frontend auth implementation and suggested improvements.*
