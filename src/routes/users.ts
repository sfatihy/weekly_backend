import { Hono } from 'hono'
import { UserRepository } from '../repositories/UserRepository'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, email, name } = await c.req.json()
        const repo = new UserRepository(c.env.DB)
        const success = await repo.createUser(id, email, name)

        if (success) return c.json({ message: 'User created' }, 201)
        return c.json({ error: 'Failed' }, 400)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/:id', async (c) => {
    const id = c.req.param('id')
    const repo = new UserRepository(c.env.DB)
    const user = await repo.getUserById(id)

    if (!user) return c.json({ error: 'User not found' }, 404)
    return c.json(user)
})

export default app
