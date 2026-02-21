# Feature: JWT Authentication System (Login, Register, Refresh)
**Status:** Pending
**Created:** 2026-02-21

## Rationale (Why?)
The current API key mechanism is a simple global lock. Users need a real authentication flow where they can register, log in, and receive personalized access to their data. We need to issue `accessToken` and `refreshToken` securely.

## Scope (What?)
1. **Database Update:** Add a `password` field to the `users` table to store securely hashed passwords. (Since Cloudflare Workers don't support native `bcrypt`, we will use the native Web Crypto API or a Worker-compatible hashing method).
2. **New Endpoints (`/auth`):**
   - `POST /auth/register`: Accepts email, password, and name. Hashes password, saves to DB. Returns tokens.
   - `POST /auth/login`: Verifies user credentials. Returns `accessToken` (short-lived) and `refreshToken` (long-lived).
   - `POST /auth/refresh`: Accepts a valid `refreshToken` and issues a new `accessToken`.
3. **Middleware Upgrade (`auth.ts`):** Transition from a static API key check to validating the JWT `accessToken` using Hono's built-in `jwt` tools.
4. **OpenAPI Definitions:** Update `openapi.ts` to include the new `/auth` endpoints.

## AI Development Guidelines
1. Read this document.
2. Formulate a detailed implementation plan and `task.md`.
3. Obtain user approval.
4. Implement the feature.
5. Move this file from `docs/features/` to `docs/changelog/` upon successful testing and commit.
