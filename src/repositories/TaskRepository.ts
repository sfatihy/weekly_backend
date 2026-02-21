export class TaskRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createTask(data: any): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO tasks (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, isGoalLog, userId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            data.id,
            data.title,
            data.description ?? null,
            data.startTime,
            data.endTime,
            data.status ?? 'pending',
            data.recurrence ?? 'none',
            data.deadlineDate ?? null,
            data.goalId ?? null,
            data.isGoalLog ? 1 : 0,
            data.userId ?? null
        ).run();
        return success;
    }

    async getTasks(userId?: string): Promise<any[]> {
        if (userId) {
            const { results } = await this.db.prepare(
                `SELECT id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, isGoalLog 
                 FROM tasks WHERE userId = ? ORDER BY startTime ASC`
            ).bind(userId).all();
            return results;
        }
        const { results } = await this.db.prepare(`SELECT * FROM tasks ORDER BY startTime ASC`).all();
        return results;
    }

    async updateTaskStatus(id: string, status: string): Promise<boolean> {
        const { meta } = await this.db.prepare(`UPDATE tasks SET status = ? WHERE id = ?`).bind(status, id).run();
        return meta.changes > 0;
    }

    async updateTask(id: string, data: Partial<any>): Promise<boolean> {
        const updates: string[] = [];
        const bindings: any[] = [];

        if (data.title !== undefined) { updates.push('title = ?'); bindings.push(data.title); }
        if (data.description !== undefined) { updates.push('description = ?'); bindings.push(data.description); }
        if (data.startTime !== undefined) { updates.push('startTime = ?'); bindings.push(data.startTime); }
        if (data.endTime !== undefined) { updates.push('endTime = ?'); bindings.push(data.endTime); }
        if (data.status !== undefined) { updates.push('status = ?'); bindings.push(data.status); }
        if (data.recurrence !== undefined) { updates.push('recurrence = ?'); bindings.push(data.recurrence); }
        if (data.deadlineDate !== undefined) { updates.push('deadlineDate = ?'); bindings.push(data.deadlineDate); }
        if (data.goalId !== undefined) { updates.push('goalId = ?'); bindings.push(data.goalId); }
        if (data.isGoalLog !== undefined) { updates.push('isGoalLog = ?'); bindings.push(data.isGoalLog ? 1 : 0); }

        if (updates.length === 0) return false;

        bindings.push(id);
        const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;

        const { meta } = await this.db.prepare(query).bind(...bindings).run();
        return meta.changes > 0;
    }

    async deleteTask(id: string): Promise<boolean> {
        const { meta } = await this.db.prepare(`DELETE FROM tasks WHERE id = ?`).bind(id).run();
        return meta.changes > 0;
    }
}
