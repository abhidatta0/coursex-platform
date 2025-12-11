import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import usersRoute from '@/routes/users.route'
import usersWebhook from '@/webhooks/users.webhooks';
import courseRoute from '@/routes/course.route';
const app = new Hono();

app.use('*', cors({
  origin:['http://localhost:5173']
}))

app.get('/', (c) => {
  return c.text('Hello Hono 1213!')
})

app.route('/users', usersRoute);
app.route('/course', courseRoute);
app.route('/webhooks/users', usersWebhook);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
