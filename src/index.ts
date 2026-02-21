import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { openApiSpec } from './openapi'

// Rotaları içeri aktarıyoruz
import usersRoute from './routes/users'
import goalsRoute from './routes/goals'
import tasksRoute from './routes/tasks'
import notesRoute from './routes/notes'
import transactionsRoute from './routes/transactions'

import { apiKeyAuth } from './middlewares/auth'

type Bindings = {
  DB: D1Database
  API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// 🟢 PUBLIC ENDPOINTS
app.get('/ui', swaggerUI({ url: '/doc' }))
app.get('/doc', (c) => c.json(openApiSpec))
app.get('/', (c) => c.text('Project Turtle D1 API is running! 🐢🚀'))

// 🔒 PROTECTED ENDPOINTS (Middleware applied)
app.use('/users/*', apiKeyAuth)
app.use('/goals/*', apiKeyAuth)
app.use('/tasks/*', apiKeyAuth)
app.use('/notes/*', apiKeyAuth)
app.use('/transactions/*', apiKeyAuth)

// MOUNTING ROUTES
app.route('/users', usersRoute)
app.route('/goals', goalsRoute)
app.route('/tasks', tasksRoute)
app.route('/notes', notesRoute)
app.route('/transactions', transactionsRoute)

export default app
