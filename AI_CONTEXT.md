# Project Turtle - AI Development Context

This file serves as the main context and rulebook for any AI assistant (Cursor, GitHub Copilot, Gemini, ChatGPT, etc.) that interacts with or helps develop this project.

## 🏗 Architecture Overview

*   **Application Type:** Cloudflare Workers (Edge Deployment)
*   **Framework:** Hono (Very lightweight)
*   **Database:** Cloudflare D1 (Serverless SQLite)
*   **Language:** TypeScript
*   **Frontend Client:** Flutter Mobile Application
*   **Original Local Storage:** Hive (NoSQL) logic -> Adapted to SQL Relational logic.
*   **Pattern:** Repository Pattern (DB Logic decoupled from Router/Controller).

## 🗄 Database Schema (D1 - SQLite)

1.  `users` (id, email, name)
2.  `goals` (id, title, targetHours, period, createdAt)
3.  `goal_logs` (id, goalId, hours, timestamp, isCompleted) -> ON DELETE CASCADE.
4.  `tasks` (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, goalLogId, userId)
5.  `notes` (id, title, content, createdAt, updatedAt, userId)
6.  `transactions` (id, title, amount, type, date, category, userId)

## 🧩 AI-Driven Development (AIDD) Rules

This project uses a file-based AI management system located in the `docs/` folder. **YOU MUST FOLLOW THESE RULES:**

### 1. Planning (ROADMAP)
Never jump straight into coding. Check `docs/ROADMAP.md` to understand where the project is heading.
- The ROADMAP serves as an index and does not hold detailed steps. It maps to filenames.
- For `[x]` completed phases, refer to the files under `docs/changelog/` mapped in Roadmap.
- For `[ ]` upcoming phases, refer to files under `docs/features/`.

### 2. Feature Implementation Lifecycle (features/ -> changelog/)
If the USER asks you to start working on a specific feature:
1.  Read the relevant markdown file inside `docs/features/` (e.g., `feature_001_auth.md`).
2.  **Delete** the file from `docs/features/`.
3.  Implement the feature in the codebase (TypeScript, SQL, tests, etc.).
4.  Once completed and tested, write a summary of what you did into a new file inside `docs/changelog/` (e.g., `003_implemented_auth.md`).
5.  This way, `docs/features` remains the backlog, and `docs/changelog` acts as our completed history.

### 3. Deployment & Testing (LOCAL ONLY = CRITICAL)
   Always test the code locally using:
   *   `npm run dev` (we use the `dev` branch locally with local DB)
   *   Swagger UI: `http://localhost:8787/ui`
   
   **CRITICAL DEPLOYMENT RULES:**
   * **NEVER execute a production deployment (`npm run deploy`)** unless explicitly, manually requested by the user. Cloudflare CI/CD will auto-deploy pushes to the `main` branch.
   * **NEVER execute D1 commands against production**. All `wrangler d1 execute` or schema migrations MUST use the `--local` flag so we don't pollute the production database during development. Example: `npx wrangler d1 execute project-turtle-db --local --file=schema.sql`

---
*Maintained by Gemini. AI Agents: Do not remove these rules, only expand them.*
