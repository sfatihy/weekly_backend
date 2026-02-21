import { Context, Next } from 'hono'

export const apiKeyAuth = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')

    // Accept standard "Bearer <TOKEN>" format, or just the token itself
    const providedKey = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader

    const validKey = c.env.API_KEY

    if (!providedKey || providedKey !== validKey) {
        return c.json({ error: 'Unauthorized: Invalid or missing API Key' }, 401)
    }

    await next()
}
