export class NoteRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createNote(id: string, title: string, content: string, userId: string): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO notes (id, title, content, userId) VALUES (?, ?, ?, ?)`
        ).bind(id, title, content, userId).run();
        return success;
    }

    async getNotes(userId?: string): Promise<any[]> {
        if (userId) {
            const { results } = await this.db.prepare(`SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC`).bind(userId).all();
            return results;
        }
        const { results } = await this.db.prepare(`SELECT * FROM notes ORDER BY updatedAt DESC`).all();
        return results;
    }
}
