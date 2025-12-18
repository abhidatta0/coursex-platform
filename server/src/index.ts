import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import usersRoute from '@/routes/users.route'
import usersWebhook from '@/webhooks/users.webhooks';
import courseRoute from '@/routes/course.route';
import sectionRoute from '@/routes/section.route';
import { errorResponse } from '@/helpers/responseHelper';
import mediaRoute from '@/routes/media.route';
const app = new Hono();

app.use('*', cors({
  origin:['http://localhost:5173']
}))

app.get('/', (c) => {
  return c.text('Hello Hono 1213!')
})

app.route('/users', usersRoute);
app.route('/course', courseRoute);
app.route('/section', sectionRoute);
app.route('/media', mediaRoute);
app.route('/webhooks/users', usersWebhook);

app.onError((error, c) => {
  return c.json(errorResponse('Internal server error', 500, error), 500);
});
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
