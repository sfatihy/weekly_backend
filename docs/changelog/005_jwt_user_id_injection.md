# Feature: JWT User ID Injection

## 📌 Context
Previously, requests to protected endpoints such as `/tasks`, `/notes`, and `/transactions` required the client to pass a `userId` explicitly in the request body (for POST requests) or as a query parameter (for GET requests). This was redundant and insecure, as users had to be trusted not to request or modify information belonging to others (BOLA / IDOR vulnerability), despite having a securely signed JWT payload available.

## 🚀 Changes Implemented

1. **Context Typing:** Upgraded `Hono` generic variables in endpoint sub-routers to properly type the `user` object obtained from the JWT payload.
2. **Backend Payload Injection:** Removed `userId` from `c.req.json()` and `c.req.query('userId')`. Replaced it with the extraction of `c.get('user').id`. Thus, the server natively handles context ownership.
3. **Swagger Contract Update:** Removed the `userId` field requirement from the `/tasks`, `/notes`, and `/transactions` endpoint schemas in `src/openapi.ts`.
4. **Flutter AI Guide Update:** Rewrote the endpoint requirement listings in `docs/FLUTTER_AI_GUIDE.md` so that the AI Frontend developer no longer attempts to send `userId` alongside requests.

## 🛠 Files Modified
- `src/routes/tasks.ts`
- `src/routes/transactions.ts`
- `src/routes/notes.ts`
- `src/openapi.ts`
- `docs/FLUTTER_AI_GUIDE.md`
