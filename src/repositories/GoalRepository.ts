export class GoalRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createGoal(id: string, title: string, targetHours: number, period: string): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO goals (id, title, targetHours, period) VALUES (?, ?, ?, ?)`
        ).bind(id, title, targetHours, period).run();
        return success;
    }

    async getAllGoals(): Promise<any[]> {
        const { results: goals } = await this.db.prepare(`SELECT * FROM goals`).all();
        const { results: tasks } = await this.db.prepare(
            `SELECT id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, isGoalLog 
             FROM tasks WHERE goalId IS NOT NULL`
        ).all();

        return goals.map((goal: any) => {
            const goalTasks = tasks.filter((t: any) => t.goalId === goal.id);
            const loggedHours = goalTasks
                .filter((t: any) => t.status === 'completed' && t.startTime && t.endTime)
                .reduce((total: number, t: any) => {
                    const start = new Date(t.startTime).getTime();
                    const end = new Date(t.endTime).getTime();
                    const hours = (end - start) / (1000 * 60 * 60);
                    return total + (hours > 0 ? hours : 0);
                }, 0);

            return {
                ...goal,
                loggedHours: Number(loggedHours.toFixed(2)),
                tasks: goalTasks
            };
        });
    }

    async deleteGoal(id: string): Promise<boolean> {
        const { meta } = await this.db.prepare(`DELETE FROM goals WHERE id = ?`).bind(id).run();
        return meta.changes > 0;
    }

    async updateGoal(id: string, data: Partial<any>): Promise<boolean> {
        const updates: string[] = [];
        const bindings: any[] = [];

        if (data.title !== undefined) { updates.push('title = ?'); bindings.push(data.title); }
        if (data.targetHours !== undefined) { updates.push('targetHours = ?'); bindings.push(data.targetHours); }
        if (data.period !== undefined) { updates.push('period = ?'); bindings.push(data.period); }

        if (updates.length === 0) return false;

        bindings.push(id);
        const query = `UPDATE goals SET ${updates.join(', ')} WHERE id = ?`;

        const { meta } = await this.db.prepare(query).bind(...bindings).run();
        return meta.changes > 0;
    }
}
