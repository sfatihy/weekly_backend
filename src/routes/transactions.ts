import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, title, amount, type, date, category, userId } = await c.req.json()
        const { success } = await c.env.DB.prepare(
            `INSERT INTO transactions (id, title, amount, type, date, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(id, title, amount, type, date, category, userId).run()
        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const userId = c.req.query('userId')
    if (userId) {
        const { results } = await c.env.DB.prepare(`SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC`).bind(userId).all()
        return c.json(results)
    }
    const { results } = await c.env.DB.prepare(`SELECT * FROM transactions ORDER BY date DESC`).all()
    return c.json(results)
})

export default app
