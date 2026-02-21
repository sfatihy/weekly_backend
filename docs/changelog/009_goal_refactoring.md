# Goals Refactoring & `isGoalLog`

## 📌 Context
The concept of tracking progress towards a Goal was previously sequestered into a separate `goal_logs` database table. This created a fractured environment because "Tasks" (calendar blocks) also inherently represent time spent on goals when they are assigned a `goalId` and marked as `completed`. Additionally, users needed a way to submit a "Quick Time Log" from the UI that shouldn't appear in their normal daily Task calendar, but should still count towards a Goal's progress.

## ✨ Changes
1. **Removed `goal_logs` Table:** The `goal_logs` table and the `goalLogId` column inside the `tasks` table were entirely dropped.
2. **Added `isGoalLog` Flag:** The `tasks` table gained an `isGoalLog` (boolean/integer) column. 
    - When a task is created via the "Quick Time Log" UI button, it sets this flag to `true`.
    - Clients can now filter out `isGoalLog: true` items from standard calendar views, rendering them invisible but mathematically significant.
3. **Enriched `GET /goals` Response:** 
    - The `GoalRepository` `getAllGoals` method was overhauled to perform relational data parsing.
    - It now returns each goal alongside a nested `tasks` array (containing all tasks assigned to that goal).
    - It pre-calculates and returns a `loggedHours` aggregate by summing the duration (`endTime - startTime`) of all `completed` tasks within that specific goal.
4. **Added `PUT /goals/:id`**: Introduced the ability to dynamically update a goal's `title`, `targetHours`, and `period` restrictions.

## 📦 Files Affected
- **Schema & Migrations:** `schema.sql`, `migration.sql`
- **Sources:** `TaskRepository.ts`, `GoalRepository.ts`
- **Routes:** `tasks.ts`, `goals.ts`
- **Docs:** `openapi.ts`, `FLUTTER_AI_GUIDE.md`
