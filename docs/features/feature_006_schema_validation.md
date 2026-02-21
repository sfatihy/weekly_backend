# Feature Specification: Schema & Payload Validation

## 🎯 Goal
Currently, the Project Turtle API relies on manual `if` checks (e.g., checking if `status` is `'pending'` or `'completed'`) or raw parsing to enforce data rules. This is dangerous and can lead to bad data entering the database (e.g., `February 30th` as a deadline, or negative amounts in transactions). 
The goal is to implement a robust, automated schema validation layer at the edge of the API so that invalid data is rejected with a `400 Bad Request` before it ever reaches the service/repository layers.

## 📦 Suggested Technical Approach (Zod & Hono Zod Validator)

The Cloudflare Workers ecosystem pairs extremely well with **Zod** (a TypeScript-first schema declaration and validation library) and `@hono/zod-validator`.

### 1. Installation
```bash
npm install zod @hono/zod-validator
```

### 2. Core Implementation Strategy
We will create a specific `schemas` folder (e.g., `src/schemas/*.ts`) and define Zod objects for every POST and PUT request.

For example, a `TaskCreateSchema`:
```typescript
import { z } from 'zod';

export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  startTime: z.string().datetime(), // Enforces strict ISO8601 validation and realistic dates
  endTime: z.string().datetime(),
  status: z.enum(['pending', 'completed']).default('pending'),
  // ...
});
```
*Note: Zod's `.datetime()` guarantees that `2026-02-31T10:00:00Z` is rejected instantly as an impossible date.*

### 3. Middleware Integration
In the route files (`tasks.ts`, `notes.ts`, `auth.ts`, etc.), we will wrap the endpoints in `zValidator`.
```typescript
import { zValidator } from '@hono/zod-validator'

app.post('/', zValidator('json', TaskCreateSchema, (result, c) => {
    if (!result.success) {
        return c.json({ error: "Validation failed", details: result.error.issues }, 400);
    }
}), async (c) => {
    const validData = c.req.valid('json'); // Automatically typed and sanitized!
    // ... proceed to Repository
})
```

## 📋 Migration Steps
1. Add `zod` and `@hono/zod-validator`.
2. Write schema definition files for `Auth`, `User`, `Task`, `Note`, `Goal`, `Transaction`.
3. Wrap all POST/PUT routes in the Hono `zValidator` middleware.
4. Remove manual `if (!email) return c.json({error: 'missing'})` checks from the route blocks since Zod will handle it.
5. Update docs with strict types.
