# Project Turtle - Roadmap

This document tracks the general vision, stages, and major features to be added in the future for Project Turtle. AI Agents should follow this path to see the next goals.

## Phase 1: Core Architecture (Completed ✅)
- [x] Cloudflare D1 (SQL) database setup.
- [x] Creation of REST API skeleton with Hono infrastructure.
- [x] Repository Pattern implementation.
- [x] Swagger UI integration.
- [x] Live (Prod) deployment to Cloudflare environment.
- [x] Establishment of AI-Driven Documentation (AIDD) structure in the `docs/` folder.

## Phase 2: API & Security (Next 🛠)
- [ ] Adding simple API Key-based Authentication or Middleware.
- [ ] Securing the routes.
- [ ] Designing the Offline synchronization logic. (Accepting data that couldn't be sent on the Flutter side in bulk).

## Phase 3: Advanced Features (Planned 🗓)
- [ ] Writing Statistics/Calculation routes (Report API) for users.
- [ ] Aggregation SQL queries producing Goal Progress graph data.
- [ ] Type & schema validation of incoming API data with Hono Validator (Zod).

## AI Workflow Rules
* If there is a request to proceed to Phase 2, the requirements of that feature must first be written into the `docs/features/` folder.
* During development, this document should be updated and progress should be marked as `[x]`.
