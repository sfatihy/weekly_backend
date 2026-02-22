# Feature: Token Rotation & Task Fixes

## 📌 Context
Two critical bugs/feature gaps were discovered during testing:
1. **D1 Type Error (`Type 'undefined' not supported`)**: When creating a task, leaving an optional variable completely out of the JSON request body caused the payload property to be `undefined`. Cloudflare D1 strictly requires `null` for empty fields and throws a 500 error if it receives `undefined`.
2. **Refresh Token Re-use / Security Gap**: The `POST /auth/refresh` endpoint was issuing a new `accessToken` but keeping the same `refreshToken` active infinitely. There was no rotation system, meaning an old refresh token could be intercepted and reused repeatedly over 30 days.

## 🚀 Changes Implemented

1. **Bugfix (D1 `undefined` constraint):**
   - Transformed all fallbacks in `TaskRepository.createTask` from `|| null` to `?? null`. The Nullish Coalescing operator correctly catches `undefined` explicitly and forces it to `null`.
2. **Feature (Token Rotation via `tokenVersion`):**
   - Altered the Database Schema via D1 command line (`ALTER TABLE users ADD COLUMN tokenVersion INTEGER DEFAULT 0`).
   - Updated `UserRepository.ts` to include an `incrementTokenVersion(id: string)` method.
   - Updated `auth.ts` logic to include a `version` claim inside the signed `refreshToken` payload matching the database.
   - Now, when `POST /auth/refresh` is called, the endpoint:
     - Verifies the JWT signature.
     - Checks if the user's current DB `tokenVersion` matches the token's `version`. If it does not, the token is rejected (preventing reuse).
     - Increments the user's DB version and returns a **freshly signed** `refreshToken` alongside the `accessToken`.
3. **Documentation Updates:**
   - Modified `/auth/refresh` documentation in OpenAPI specs (`src/openapi.ts`).
   - Emphasized in the Native Flutter App instructions (`docs/FLUTTER_AI_GUIDE.md`) that the client **must overwrite** the securely stored `refreshToken` with the new one returned by the `/refresh` endpoint.
