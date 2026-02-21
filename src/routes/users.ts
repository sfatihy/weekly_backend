import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, email, name } = await c.req.json()
        const { success } = await c.env.DB.prepare(
            `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`
        ).bind(id, email, name).run()

        if (success) return c.json({ message: 'User created' }, 201)
        return c.json({ error: 'Failed' }, 400)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/:id', async (c) => {
    const id = c.req.param('id')
    const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first()
    if (!user) return c.json({ error: 'User not found' }, 404)
    return c.json(user)
})

export default app
