import { Hono } from 'hono'
import { NoteRepository } from '../repositories/NoteRepository'

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
        const { id, title, content } = await c.req.json()
        const user = c.get('user')
        const userId = user.id
        const repo = new NoteRepository(c.env.DB)
        const success = await repo.createNote(id, title, content, userId)

        return c.json({ success }, 201)
    } catch (e: any) {
        return c.json({ error: e.message }, 500)
    }
})

app.get('/', async (c) => {
    const user = c.get('user')
    const userId = user.id
    const repo = new NoteRepository(c.env.DB)
    const results = await repo.getNotes(userId)

    return c.json(results)
})

app.delete('/:id', async (c) => {
    const id = c.req.param('id')
    const repo = new NoteRepository(c.env.DB)
    const success = await repo.deleteNote(id)

    if (!success) {
        return c.json({ error: 'Failed to delete note or note not found' }, 404)
    }

    return c.json({ message: 'Note deleted successfully' }, 200)
})

export default app
