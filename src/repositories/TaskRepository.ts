export class TaskRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createTask(data: any): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO tasks (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, goalLogId, userId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            data.id,
            data.title,
            data.description || null,
            data.startTime,
            data.endTime,
            data.status || 'pending',
            data.recurrence || 'none',
            data.deadlineDate || null,
            data.goalId || null,
            data.goalLogId || null,
            data.userId || null
        ).run();
        return success;
    }

    async getTasks(userId?: string): Promise<any[]> {
        if (userId) {
            const { results } = await this.db.prepare(`SELECT * FROM tasks WHERE userId = ? ORDER BY startTime ASC`).bind(userId).all();
            return results;
        }
        const { results } = await this.db.prepare(`SELECT * FROM tasks ORDER BY startTime ASC`).all();
        return results;
    }

    async updateTaskStatus(id: string, status: string): Promise<boolean> {
        const { success } = await this.db.prepare(`UPDATE tasks SET status = ? WHERE id = ?`).bind(status, id).run();
        return success;
    }
}
