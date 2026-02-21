import { Hono } from 'hono'
import { TaskRepository } from '../repositories/TaskRepository'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const repo = new TaskRepository(c.env.DB)
        const success = await repo.createTask(body)

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const userId = c.req.query('userId')
    const repo = new TaskRepository(c.env.DB)
    const results = await repo.getTasks(userId)

    return c.json(results)
})

app.put('/:id/status', async (c) => {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    const repo = new TaskRepository(c.env.DB)
    const success = await repo.updateTaskStatus(id, status)

    return c.json({ success })
})

export default app
