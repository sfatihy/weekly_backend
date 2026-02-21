export class UserRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createUser(id: string, email: string, name: string): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`
        ).bind(id, email, name).run();
        return success;
    }

    async getUserById(id: string): Promise<any> {
        const user = await this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
        return user;
    }
}
