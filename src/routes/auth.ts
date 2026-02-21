import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { UserRepository } from '../repositories/UserRepository'
import { hashPassword, verifyPassword } from '../utils/hash'

type Bindings = {
    DB: D1Database
    JWT_SECRET: string
    REFRESH_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.post('/register', async (c) => {
    try {
        const { email, password, name } = await c.req.json()
        if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

        const repo = new UserRepository(c.env.DB)

        // Check if user exists
        const existing = await repo.getUserByEmail(email)
        if (existing) return c.json({ error: 'Email already in use' }, 400)

        const id = crypto.randomUUID()
        const passwordHash = await hashPassword(password)

        const success = await repo.createUser(id, email, passwordHash, name || '')
        if (!success) return c.json({ error: 'Failed to create user' }, 500)

        // Generate Tokens
        const accessToken = await sign({ id, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET) // 1 day
        const refreshToken = await sign({ id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, c.env.REFRESH_SECRET) // 30 days

        return c.json({ message: 'User registered successfully', accessToken, refreshToken }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json()
        if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

        const repo = new UserRepository(c.env.DB)
        const user = await repo.getUserByEmail(email)

        if (!user) return c.json({ error: 'Invalid credentials' }, 401)

        const isValid = await verifyPassword(password, user.password)
        if (!isValid) return c.json({ error: 'Invalid credentials' }, 401)

        // Generate Tokens
        const accessToken = await sign({ id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET)
        const refreshToken = await sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, c.env.REFRESH_SECRET)

        return c.json({ message: 'Login successful', accessToken, refreshToken }, 200)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

import { verify } from 'hono/jwt'

app.post('/refresh', async (c) => {
    try {
        const { refreshToken } = await c.req.json()
        if (!refreshToken) return c.json({ error: 'Refresh token required' }, 400)

        // Verify refresh token
        const decoded = await verify(refreshToken, c.env.REFRESH_SECRET, "HS256")
        if (!decoded.id) return c.json({ error: 'Invalid token' }, 401)

        const repo = new UserRepository(c.env.DB)
        const user = await repo.getUserById(decoded.id as string)

        if (!user) return c.json({ error: 'User not found' }, 404)

        // Generate new Access Token
        const newAccessToken = await sign({ id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, c.env.JWT_SECRET)

        return c.json({ accessToken: newAccessToken }, 200)
    } catch (e: any) {
        return c.json({ error: 'Invalid or expired refresh token' }, 401)
    }
})

export default app
