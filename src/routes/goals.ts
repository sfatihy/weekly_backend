import { Hono } from 'hono'
import { GoalRepository } from '../repositories/GoalRepository'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, title, targetHours, period } = await c.req.json()
        const repo = new GoalRepository(c.env.DB)
        const success = await repo.createGoal(id, title, targetHours, period)

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const repo = new GoalRepository(c.env.DB)
    const results = await repo.getAllGoals()

    return c.json(results)
})

app.post('/:goalId/logs', async (c) => {
    try {
        const goalId = c.req.param('goalId')
        const { id, hours, timestamp, isCompleted } = await c.req.json()
        const repo = new GoalRepository(c.env.DB)

        const success = await repo.addGoalLog(id, goalId, hours, timestamp, isCompleted)
        return c.json({ success, message: "Log added" }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/:goalId/logs', async (c) => {
    const goalId = c.req.param('goalId')
    const repo = new GoalRepository(c.env.DB)

    const results = await repo.getGoalLogs(goalId)
    return c.json(results)
})

app.delete('/:goalId', async (c) => {
    const goalId = c.req.param('goalId')
    const repo = new GoalRepository(c.env.DB)
    const success = await repo.deleteGoal(goalId)

    if (!success) {
        return c.json({ error: 'Failed to delete goal or goal not found' }, 404)
    }

    return c.json({ message: 'Goal deleted successfully' }, 200)
})

app.delete('/:goalId/logs/:logId', async (c) => {
    const logId = c.req.param('logId')
    const repo = new GoalRepository(c.env.DB)
    const success = await repo.deleteGoalLog(logId)

    if (!success) {
        return c.json({ error: 'Failed to delete goal log or log not found' }, 404)
    }

    return c.json({ message: 'Goal log deleted successfully' }, 200)
})

export default app
