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
import authRoute from './routes/auth'

import { jwtAuth } from './middlewares/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  REFRESH_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// 🟢 PUBLIC ENDPOINTS
app.get('/ui', swaggerUI({ url: '/doc' }))
app.get('/doc', (c) => c.json(openApiSpec))
app.get('/', (c) => c.text('Project Turtle D1 API is running! 🐢🚀'))

app.route('/auth', authRoute) // Auth endpoints should be public

// 🔒 PROTECTED ENDPOINTS (JWT Middleware applied)
app.use('/users/*', jwtAuth)
app.use('/goals/*', jwtAuth)
app.use('/tasks/*', jwtAuth)
app.use('/notes/*', jwtAuth)
app.use('/transactions/*', jwtAuth)

// MOUNTING ROUTES
app.route('/users', usersRoute)
app.route('/goals', goalsRoute)
app.route('/tasks', tasksRoute)
app.route('/notes', notesRoute)
app.route('/transactions', transactionsRoute)

export default app
