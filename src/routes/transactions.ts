import { Hono } from 'hono'
import { TransactionRepository } from '../repositories/TransactionRepository'

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
        const repo = new TransactionRepository(c.env.DB)
        const success = await repo.createTransaction(body)

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const user = c.get('user')
    const userId = user.id
    const repo = new TransactionRepository(c.env.DB)
    const results = await repo.getTransactions(userId)

    return c.json(results)
})

export default app
