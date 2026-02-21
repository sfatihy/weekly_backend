# Feature: Token Blacklist / Session Management

## 📌 Context
Currently, the JWT authentication system is completely **stateless**. The backend relies purely on the mathematical verification of the JWT signature (`JWT_SECRET` and `REFRESH_SECRET`) to authenticate users.

While this approach is highly performant and scalable, it comes with a trade-off: **Tokens cannot be immediately revoked.** 
If a user clicks "Logout", or if their account gets compromised and they change their password, the previously issued `accessToken` and `refreshToken` will mathematically remain valid until their expiration times (`exp`) are reached.

## 🎯 Goal
To enhance security, we need to implement a mechanism to invalidate tokens dynamically. 

## 🛠 Proposed Solutions (To be decided when implementing)

### Option 1: Token Blacklisting (Deny-list)
- Create a `token_blacklist` table in the D1 Database.
- When a user logs out, their current `refreshToken` (and optionally `accessToken`) is added to this table.
- **Middleware Update:** The `jwtAuth` middleware must perform a quick database lookup to ensure the provided token is not in the blacklist. 
- **Pros:** Still relatively fast, only stores invalidated tokens.
- **Cons:** Requires a database query on every protected route, slightly reducing the performance benefits of stateless JWTs. We would need a cleanup cron job to remove expired tokens from the blacklist to prevent the table from growing indefinitely.

### Option 2: Session Management / Refresh Token Whitelisting
- Create a `sessions` table (e.g., `id`, `userId`, `refreshToken`, `deviceInfo`, `expiresAt`, `isValid`).
- When logging in, a new session is created and tracked.
- **Middleware Update:** The backend only verifies the `accessToken` statelessly (as it does now), keeping requests blazing fast.
- **Refresh Flow Update:** When the client calls `POST /auth/refresh`, the backend checks the `sessions` table. If the session is invalid or the refresh token doesn't match, it denies the refresh.
- **Pros:** Access tokens remain fast and stateless. Users can view "Active Sessions" and remotely log out of other devices.
- **Cons:** `accessToken` still remains valid for its short lifespan (e.g., 24 hours) even after logout.

### Option 3: User Versioning (`tokenVersion`)
- Add a `tokenVersion` (integer) column to the `users` table.
- Include the `tokenVersion` in the JWT payload during creation.
- **Middleware Update:** Check if the `tokenVersion` in the token matches the `tokenVersion` in the database.
- **Revocation:** If a user logs out everywhere or changes their password, simply increment their `tokenVersion` in the database. All previously issued tokens will instantly become invalid.
- **Pros:** Incredibly simple. One database query to fetch the user (which we might need anyway for advanced routes).
- **Cons:** Still requires a DB lookup. It logs the user out from *all* devices simultaneously, not just the one they clicked "logout" on.

## 📅 Status
**Planned** - This feature is currently in the backlog and will be implemented in a future phase when strict logout/session revocation requirements arise.
