import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { openApiSpec } from './openapi'

// Cloudflare ortamındaki 'DB' isimli D1 veritabanı değişkenini tanıtıyoruz.
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Uygulama Flutter veya farklı web kaynaklarından çağrıldığında
// CORS hatası almamak için tüm portları ve kaynakları (CORS) serbest bırakıyoruz.
app.use('*', cors())

// 🟢 SWAGGER UI ARAYÜZÜ VE DÖKÜMANTASYON API'Sİ
app.get('/ui', swaggerUI({ url: '/doc' }))
app.get('/doc', (c) => c.json(openApiSpec))

// 🟢 TEMEL KONTROL (Sağlık kontrolü)
app.get('/', (c) => {
  return c.text('Project Turtle D1 API is running! 🐢🚀')
})

// ==========================================
// 🧑‍💻 1. USERS (Kullanıcılar) API
// ==========================================
app.post('/users', async (c) => {
  try {
    const { id, email, name } = await c.req.json()
    const { success } = await c.env.DB.prepare(
      `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`
    ).bind(id, email, name).run()

    if (success) return c.json({ message: 'User created' }, 201)
    return c.json({ error: 'Failed' }, 400)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first()
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json(user)
})

// ==========================================
// 🎯 2. GOALS & LOGS (Hedefler ve Kayıtları) API
// ==========================================
app.post('/goals', async (c) => {
  try {
    const { id, title, targetHours, period } = await c.req.json()
    const { success } = await c.env.DB.prepare(
      `INSERT INTO goals (id, title, targetHours, period) VALUES (?, ?, ?, ?)`
    ).bind(id, title, targetHours, period).run()

    return c.json({ success })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/goals', async (c) => {
  const { results } = await c.env.DB.prepare(`SELECT * FROM goals`).all()
  return c.json(results)
})

// Belirli bir hedefin loglarını (GoalLog) eklemek için
app.post('/goals/:goalId/logs', async (c) => {
  try {
    const goalId = c.req.param('goalId')
    const { id, hours, timestamp, isCompleted } = await c.req.json()
    const valCompleted = isCompleted ? 1 : 0 // SQLite boolean değerleri 0 ve 1 kullanır.

    const { success } = await c.env.DB.prepare(
      `INSERT INTO goal_logs (id, goalId, hours, timestamp, isCompleted) VALUES (?, ?, ?, ?, ?)`
    ).bind(id, goalId, hours, timestamp, valCompleted).run()

    return c.json({ success, message: "Log added" }, 201)
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/goals/:goalId/logs', async (c) => {
  const goalId = c.req.param('goalId')
  const { results } = await c.env.DB.prepare(`SELECT * FROM goal_logs WHERE goalId = ?`).bind(goalId).all()
  return c.json(results)
})

// ==========================================
// ✅ 3. TASKS (Görevler) API
// ==========================================
app.post('/tasks', async (c) => {
  try {
    const body = await c.req.json()
    const { success } = await c.env.DB.prepare(
      `INSERT INTO tasks (id, title, description, startTime, endTime, status, recurrence, deadlineDate, goalId, goalLogId, userId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      body.id,
      body.title,
      body.description || null,
      body.startTime,
      body.endTime,
      body.status || 'pending',
      body.recurrence || 'none',
      body.deadlineDate || null,
      body.goalId || null,
      body.goalLogId || null,
      body.userId || null
    ).run()

    return c.json({ success })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/tasks', async (c) => {
  const userId = c.req.query('userId') // Flutter tarafından `?userId=xxx` şeklinde çağrılırsa diye.

  if (userId) {
    const { results } = await c.env.DB.prepare(`SELECT * FROM tasks WHERE userId = ? ORDER BY startTime ASC`).bind(userId).all()
    return c.json(results)
  }

  const { results } = await c.env.DB.prepare(`SELECT * FROM tasks ORDER BY startTime ASC`).all()
  return c.json(results)
})

// Görev durumunu (Task Status) güncellemek için:
app.put('/tasks/:id/status', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  const { success } = await c.env.DB.prepare(`UPDATE tasks SET status = ? WHERE id = ?`).bind(status, id).run()
  return c.json({ success })
})

// ==========================================
// 📓 4. NOTES (Notlar) API
// ==========================================
app.post('/notes', async (c) => {
  try {
    const { id, title, content, userId } = await c.req.json()
    const { success } = await c.env.DB.prepare(
      `INSERT INTO notes (id, title, content, userId) VALUES (?, ?, ?, ?)`
    ).bind(id, title, content, userId).run()
    return c.json({ success })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/notes', async (c) => {
  const userId = c.req.query('userId')
  if (userId) {
    const { results } = await c.env.DB.prepare(`SELECT * FROM notes WHERE userId = ? ORDER BY updatedAt DESC`).bind(userId).all()
    return c.json(results)
  }
  const { results } = await c.env.DB.prepare(`SELECT * FROM notes ORDER BY updatedAt DESC`).all()
  return c.json(results)
})

// ==========================================
// 💰 5. FINANCE (Finans / İşlemler) API
// ==========================================
app.post('/transactions', async (c) => {
  try {
    const { id, title, amount, type, date, category, userId } = await c.req.json()
    const { success } = await c.env.DB.prepare(
      `INSERT INTO transactions (id, title, amount, type, date, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, title, amount, type, date, category, userId).run()
    return c.json({ success })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/transactions', async (c) => {
  const userId = c.req.query('userId')
  if (userId) {
    const { results } = await c.env.DB.prepare(`SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC`).bind(userId).all()
    return c.json(results)
  }
  const { results } = await c.env.DB.prepare(`SELECT * FROM transactions ORDER BY date DESC`).all()
  return c.json(results)
})

// Son olarak Hono uygulamamızın ana motorunu dışa aktarıyoruz. (Cloudflare Workers'ı ayağa kaldırır)
export default app
