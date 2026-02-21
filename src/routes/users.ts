import { Hono } from 'hono'
import { UserRepository } from '../repositories/UserRepository'
import { hashPassword } from '../utils/hash'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/', async (c) => {
    try {
        const { id, email, name, password } = await c.req.json()
        const repo = new UserRepository(c.env.DB)

        // Use provided password or generate a random one if hitting /users directly
        const pwdToHash = password || crypto.randomUUID()
        const passwordHash = await hashPassword(pwdToHash)

        const success = await repo.createUser(id, email, passwordHash, name)

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
