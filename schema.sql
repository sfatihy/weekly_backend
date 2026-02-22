-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    tokenVersion INTEGER DEFAULT 0
);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    targetHours REAL NOT NULL,
    period TEXT, -- 'weekly', 'monthly', 'yearly'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed'
    recurrence TEXT DEFAULT 'none', -- 'none', 'daily', 'weekly', 'monthly'
    deadlineDate DATETIME,
    goalId TEXT,
    isGoalLog INTEGER DEFAULT 0, -- Used to separate quick time logs from regular tasks
    userId TEXT, -- Added to link task to user based on ERD
    FOREIGN KEY (goalId) REFERENCES goals(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId TEXT, -- Added to link note to user based on ERD
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions (Finance Module) Table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL, -- 'income' or 'expense'
    date DATETIME NOT NULL,
    category TEXT NOT NULL,
    userId TEXT, -- Added to link transaction to user based on ERD
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
