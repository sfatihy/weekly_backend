# Local Test and AI Documentation (Artifact) Plan

## Objective
In this plan, we have two goals:
1. Determine how we can test the system locally without being involved in the deployment process (no Deploy action).
2. Move the "brain" (Artifact / Memory) files created by the AI assistant directly into the GitHub (Project) directory so that future developers or AI assistants can understand the project and continue healthily from where we left off.

## Proposed Changes

### 1. Saving Artifacts Specifically to the Project
Currently, AI tools work in hidden folders outside the project (like `.gemini/antigravity/...`) to understand projects. We will transfer this information into the project:

*   A folder named `.ai/`, `.cursorrules`, or directly `docs/ai_artifacts/` will be created in the root directory of the project.
*   I will copy the memory/planning files I have created so far, such as `task.md` (Task list), `implementation_plan.md`, into this folder.
*   Additionally, I will create an `AI_CONTEXT.md` file with the main theme **"What AI Needs to Know About the Project"**. When someone forks the project after you or asks another AI, that AI will instantly recall the entire architecture by reading this file: "Hmm, this is an application supported by Flutter/Hive, written with Cloudflare D1 database, Hono infrastructure, and uses the Repository pattern."

### 2. Continuous Local Test Environment
From now on, every time we touch the codes (after refactoring, etc.), we will strictly perform a Local Test *before* "Deploying".
Steps for this:
*   Our Local D1 Database is already standing by with the command `npx wrangler d1 execute turtle-db --local --file=./schema.sql`.
*   When we start the `npm run dev` command, the API boots up at `http://localhost:8787`.
*   We will do the Swagger tests (`http://localhost:8787/ui`) directly over this **local** environment, not production, and make sure there are no problems first. Then we will Deploy.

## Validation
When these changes are completed, exploring the `docs/` or `ai_artifacts/` folders in the project's folder hierarchy will verify that all past decisions of the system are available in a readable markdown format.
