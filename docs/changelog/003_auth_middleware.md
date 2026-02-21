# Feature: Simple Authentication API Key
**Status:** Pending
**Created:** 2026-02-21

## Rationale (Why?)
Currently, the API is completely open. Anyone outside the Flutter application can find the endpoint and write fake tasks to our D1 database. We need a simple firewall (Middleware).

## Scope (What?)
1. Write a global middleware (or specific middleware function) in Hono to check the `Authorization` header of incoming requests.
2. Establish a simple `API_KEY` mechanism (for example, a fixed password pulled via Wrangler Secret or `wrangler.jsonc`).
3. Return `401 Unauthorized` for invalid ones.
4. (Optional): Auth-related fields can be added to the `users` table or Firebase-style token ID verification can be performed.

## AI Development Guidelines
If you are asked to "start" this task:
1. Read this document.
2. Create a `task.md` for yourself.
3. Implement and test the code.
4. Delete this document from under `features/` and move it under `changelog/` (e.g., `003_auth_middleware.md`).
