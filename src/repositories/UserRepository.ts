export class UserRepository {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    async createUser(id: string, email: string, passwordHash: string, name: string): Promise<boolean> {
        const { success } = await this.db.prepare(
            `INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)`
        ).bind(id, email, passwordHash, name).run();
        return success;
    }

    async getUserById(id: string): Promise<any> {
        const user = await this.db.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
        return user;
    }

    async getUserByEmail(email: string): Promise<any> {
        const user = await this.db.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();
        return user;
    }

    async incrementTokenVersion(id: string): Promise<number> {
        // Fetch current to increment safely
        const user = await this.getUserById(id);
        if (!user) return 0;

        const newVersion = (user.tokenVersion || 0) + 1;
        await this.db.prepare(`UPDATE users SET tokenVersion = ? WHERE id = ?`).bind(newVersion, id).run();
        return newVersion;
    }
}
