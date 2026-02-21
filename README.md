# Project Turtle (Weekly Backend) 🐢

Project Turtle is a lightweight, serverless backend API built for a Flutter mobile application. It is designed to be highly scalable, completely serverless, and developed under an AI-Driven Development (AIDD) workflow.

## 🚀 Tech Stack

- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com/) (Edge Deployment)
- **Framework:** [Hono](https://hono.dev/) (Ultrafast web framework)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
- **Language:** TypeScript
- **Documentation:** Swagger / OpenAPI UI

## 🏗 Architecture

- **Repository Pattern:** Database queries are decoupled from the routing logic.
- **JWT Authentication:** Secure user registration, login, and token refresh mechanisms integrated natively.
- **AI-Driven Documentation (AIDD):** Instead of disorganized task lists, this project relies on a strictly maintained `docs/` folder:
  - `docs/ROADMAP.md`: The single source of truth for the project's vision.
  - `docs/features/`: Backlog of upcoming feature specs.
  - `docs/changelog/`: Historical log of completed implementations.

## 🛠 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Setup local D1 Database (Re-create schema)
npx wrangler d1 execute turtle-db --local --file=./schema.sql
# Note: Ensure you match your DB name if it's turtle-db-prod in wrangler.json

# 3. Start the local server
npm run dev
```

Server will typically start at `http://localhost:8787`.

## 🧪 Testing the API

Once the local server is running, navigate to:
👉 `http://localhost:8787/ui`

You will see the Swagger UI. You can create a new user via `/auth/register`, copy the `accessToken`, click the **Authorize 🔒** button, and paste the token to test protected routes (`/users`, `/tasks`, `/goals`, etc.).

## ☁️ Deployment

When you are ready to push to production:

```bash
npm run deploy
```

*Don't forget to run your remote D1 schema migrations when initially setting up the production database!*

---
**Maintained by AI Assistants (AIDD) & Human Developers.**
