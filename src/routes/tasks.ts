import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const { success } = await c.env.DB.prepare(
            `INSERT INTO tasks (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, goalLogId, userId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            body.id,
            body.title,
            body.description || null,
            body.startTime,
            body.endTime,
            body.status || 'pending',
            body.recurrence || 'none',
            body.deadlineDate || null,
            body.goalId || null,
            body.goalLogId || null,
            body.userId || null
        ).run()

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const userId = c.req.query('userId')

    if (userId) {
        const { results } = await c.env.DB.prepare(`SELECT * FROM tasks WHERE userId = ? ORDER BY startTime ASC`).bind(userId).all()
        return c.json(results)
    }

    const { results } = await c.env.DB.prepare(`SELECT * FROM tasks ORDER BY startTime ASC`).all()
    return c.json(results)
})

app.put('/:id/status', async (c) => {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    const { success } = await c.env.DB.prepare(`UPDATE tasks SET status = ? WHERE id = ?`).bind(status, id).run()
    return c.json({ success })
})

export default app
