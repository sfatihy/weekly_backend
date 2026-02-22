# Feature Specification: Automated API Testing (Vitest)

## 🎯 Goal
Replace manual Postman and cURL testing with an automated Integration Testing suite to ensure logic holds up against regressions. This allows continuous integration and peace of mind when refactoring the D1 Database or the Hono Routers in Project Turtle.

## 📦 Suggested Technical Approach (Vitest + Workers Pool)
To write tests that accurately emulate Cloudflare Workers and interact safely with an ephemeral D1 Database, we will utilize `@cloudflare/vitest-pool-workers`.

### 1. Tooling
```bash
npm install --save-dev vitest @cloudflare/vitest-pool-workers
```

### 2. Configuration Setup
We must create `vitest.config.ts` to instruct Vitest to run code inside the simulated `workerd` (Workers runtime):
```typescript
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
});
```

### 3. Database Fixtures (BeforeAll hooks)
Tests using D1 must execute `schema.sql` within a setup hook (`beforeAll` or `beforeEach`) so that the local ephemeral D1 database has the correct tables (`users`, `tasks`, etc.) before `app.fetch` tries to perform queries.

### 4. Integration Routing
We will not mock Hono. We will directly instantiate our `app` and pass `Request` objects to its `.fetch()` handler:
```typescript
import app from '../src/index';

test('POST /auth/register creates user', async () => {
    // We pass our D1 binding simulation
    const res = await app.fetch(
        new Request('http://localhost/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@mail.com', password: '123', name: 'Tester' })
        }),
        { DB: env.DB } // Simulated bindings
    );
    expect(res.status).toBe(201);
});
```

## 📋 Migration Steps
1. Install testing dependencies.
2. Initialize and write standard `vitest.config.ts`.
3. Write `tests/setup.ts` to run D1 Migrations / `schema.sql` before memory testing runs.
4. Add npm script `npm run test`.
5. Cover `Auth` (Registration, Token Parsing).
6. Cover CRUD endpoints (`Tasks`, etc.) utilizing Mocked Bearer Tokens.
