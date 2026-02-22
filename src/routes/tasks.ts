import { Hono } from 'hono'
import { TaskRepository } from '../repositories/TaskRepository'

type Bindings = {
    DB: D1Database
}

type Variables = {
    user: {
        id: string
        email: string
        exp: number
    }
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const user = c.get('user')
        body.userId = user.id
        body.id = crypto.randomUUID()
        const repo = new TaskRepository(c.env.DB)
        const success = await repo.createTask(body)

        return c.json({ success, id: body.id }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const user = c.get('user')
    const userId = user.id
    const repo = new TaskRepository(c.env.DB)
    const results = await repo.getTasks(userId)

    return c.json(results)
})

app.put('/:id/status', async (c) => {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    if (status !== 'pending' && status !== 'completed') {
        return c.json({ error: 'Invalid status. Must be pending or completed' }, 400)
    }
    const repo = new TaskRepository(c.env.DB)
    const success = await repo.updateTaskStatus(id, status)

    return c.json({ success })
})

app.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    if (body.status !== undefined && body.status !== 'pending' && body.status !== 'completed') {
        return c.json({ error: 'Invalid status. Must be pending or completed' }, 400)
    }
    const repo = new TaskRepository(c.env.DB)
    const success = await repo.updateTask(id, body)

    if (!success) {
        return c.json({ error: 'Failed to update task or no changes provided' }, 400)
    }

    return c.json({ message: 'Task updated successfully' }, 200)
})

app.delete('/:id', async (c) => {
    const id = c.req.param('id')
    const repo = new TaskRepository(c.env.DB)
    const success = await repo.deleteTask(id)

    if (!success) {
        return c.json({ error: 'Failed to delete task or task not found' }, 404)
    }

    return c.json({ message: 'Task deleted successfully' }, 200)
})

export default app
