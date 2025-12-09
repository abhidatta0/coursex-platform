import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import usersRoute from './routes/users.route'
import usersWebhooks from './webhooks/users.webhooks'
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono 1213!')
})

app.route('/users', usersRoute);
app.route('/webhooks/users', usersWebhooks);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
