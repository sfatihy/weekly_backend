export class TransactionRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createTransaction(data: any): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO transactions (id, title, amount, type, date, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(data.id, data.title, data.amount, data.type, data.date, data.category, data.userId).run();
        return success;
    }

    async getTransactions(userId?: string): Promise<any[]> {
        if (userId) {
            const { results } = await this.db.prepare(
                `SELECT id, title, amount, type, date, category FROM transactions WHERE userId = ? ORDER BY date DESC`
            ).bind(userId).all();
            return results;
        }
        const { results } = await this.db.prepare(`SELECT * FROM transactions ORDER BY date DESC`).all();
        return results;
    }

    async deleteTransaction(id: string): Promise<boolean> {
        const { meta } = await this.db.prepare(`DELETE FROM transactions WHERE id = ?`).bind(id).run();
        return meta.changes > 0;
    }
}
