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
        const { results } = await this.db.prepare(`SELECT * FROM goals`).all();
        return results;
    }

    async addGoalLog(id: string, goalId: string, hours: number, timestamp: string, isCompleted: boolean): Promise<boolean> {
        const valCompleted = isCompleted ? 1 : 0;
        const { success } = await this.db.prepare(
            `INSERT INTO goal_logs (id, goalId, hours, timestamp, isCompleted) VALUES (?, ?, ?, ?, ?)`
        ).bind(id, goalId, hours, timestamp, valCompleted).run();
        return success;
    }

    async getGoalLogs(goalId: string): Promise<any[]> {
        const { results } = await this.db.prepare(`SELECT * FROM goal_logs WHERE goalId = ?`).bind(goalId).all();
        return results;
    }

    async deleteGoal(id: string): Promise<boolean> {
        const { success } = await this.db.prepare(`DELETE FROM goals WHERE id = ?`).bind(id).run();
        return success;
    }

    async deleteGoalLog(id: string): Promise<boolean> {
        const { success } = await this.db.prepare(`DELETE FROM goal_logs WHERE id = ?`).bind(id).run();
        return success;
    }
}
