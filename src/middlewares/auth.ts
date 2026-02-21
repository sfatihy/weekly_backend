import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'

export const jwtAuth = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader

    if (!token) {
        return c.json({ error: 'Unauthorized: Missing token' }, 401)
    }

    try {
        const validPayload = await verify(token, c.env.JWT_SECRET, "HS256")
        // Attach user information to context so routes can use it
        c.set('user', validPayload)
        await next()
    } catch (err) {
        return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
    }
}
