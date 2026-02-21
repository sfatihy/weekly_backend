-- MIGRATION: 002_goal_logs_refactor
-- Apply this file to PRODUCTION using: npx wrangler d1 execute turtle-db-prod --remote --file=migration.sql

-- 1. Drop the obsolete goal_logs table completely
DROP TABLE IF EXISTS goal_logs;

-- 2. Create the new tasks table without goalLogId and with isGoalLog
CREATE TABLE tasks_new (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', 
    recurrence TEXT DEFAULT 'none', 
    deadlineDate DATETIME,
    goalId TEXT,
    isGoalLog INTEGER DEFAULT 0, -- NEW COLUMN
    userId TEXT, 
    FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Copy existing data (goalLogId is naturally dropped in this step)
-- Since isGoalLog didn't exist, we default them all to 0
INSERT INTO tasks_new (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, isGoalLog, userId)
SELECT id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, 0, userId FROM tasks;

-- 4. Replace the old tasks table with the newly formed one
DROP TABLE tasks;
ALTER TABLE tasks_new RENAME TO tasks;
