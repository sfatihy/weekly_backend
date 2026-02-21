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

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// 🟢 SWAGGER UI ARAYÜZÜ VE DÖKÜMANTASYON API'Sİ
app.get('/ui', swaggerUI({ url: '/doc' }))
app.get('/doc', (c) => c.json(openApiSpec))

// 🟢 TEMEL KONTROL (Sağlık kontrolü)
app.get('/', (c) => {
  return c.text('Project Turtle D1 API is running! 🐢🚀')
})

// MİNİ UYGULAMALARI (Rotaları) ANA UYGULAMAYA BAĞLAMA (Mounting)
app.route('/users', usersRoute)
app.route('/goals', goalsRoute)
app.route('/tasks', tasksRoute)
app.route('/notes', notesRoute)
app.route('/transactions', transactionsRoute)

export default app
