import { Hono } from 'hono'
import { GoalRepository } from '../repositories/GoalRepository'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { title, targetHours, period } = await c.req.json()
        const id = crypto.randomUUID()
        const repo = new GoalRepository(c.env.DB)
        const success = await repo.createGoal(id, title, targetHours, period)

        return c.json({ success, id }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const repo = new GoalRepository(c.env.DB)
    const results = await repo.getAllGoals()

    return c.json(results)
})

app.put('/:id', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    const repo = new GoalRepository(c.env.DB)
    const success = await repo.updateGoal(id, body)

    if (!success) {
        return c.json({ error: 'Failed to update goal or no changes provided' }, 400)
    }

    return c.json({ message: 'Goal updated successfully' }, 200)
})

app.delete('/:id', async (c) => {
    const id = c.req.param('id')
    const repo = new GoalRepository(c.env.DB)
    const success = await repo.deleteGoal(id)

    if (!success) {
        return c.json({ error: 'Failed to delete goal or goal not found' }, 404)
    }

    return c.json({ message: 'Goal deleted successfully' }, 200)
})

export default app
