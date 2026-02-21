import { Hono } from 'hono'
import { TransactionRepository } from '../repositories/TransactionRepository'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const repo = new TransactionRepository(c.env.DB)
        const success = await repo.createTransaction(body)

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const userId = c.req.query('userId')
    const repo = new TransactionRepository(c.env.DB)
    const results = await repo.getTransactions(userId)

    return c.json(results)
})

export default app
