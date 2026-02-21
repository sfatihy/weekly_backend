import { Hono } from 'hono'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, title, targetHours, period } = await c.req.json()
        const { success } = await c.env.DB.prepare(
            `INSERT INTO goals (id, title, targetHours, period) VALUES (?, ?, ?, ?)`
        ).bind(id, title, targetHours, period).run()

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const { results } = await c.env.DB.prepare(`SELECT * FROM goals`).all()
    return c.json(results)
})

app.post('/:goalId/logs', async (c) => {
    try {
        const goalId = c.req.param('goalId')
        const { id, hours, timestamp, isCompleted } = await c.req.json()
        const valCompleted = isCompleted ? 1 : 0

        const { success } = await c.env.DB.prepare(
            `INSERT INTO goal_logs (id, goalId, hours, timestamp, isCompleted) VALUES (?, ?, ?, ?, ?)`
        ).bind(id, goalId, hours, timestamp, valCompleted).run()

        return c.json({ success, message: "Log added" }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/:goalId/logs', async (c) => {
    const goalId = c.req.param('goalId')
    const { results } = await c.env.DB.prepare(`SELECT * FROM goal_logs WHERE goalId = ?`).bind(goalId).all()
    return c.json(results)
})

export default app
