import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import usersRoute from '@/routes/users.route'
import usersWebhook from '@/webhooks/users.webhooks';
import courseRoute from '@/routes/course.route';
import sectionRoute from '@/routes/section.route';
import { errorResponse } from '@/helpers/responseHelper';
import mediaRoute from '@/routes/media.route';
import lessonRoute from '@/routes/lesson.route';
import productRoute from '@/routes/product.route';
import orderRoute from './routes/student/product-order.route';
import studentProductRoute from './routes/student/product.route';
import purchaseRoute from './routes/student/purchase.route';
import studentCourseRoute from './routes/student/course.route';
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
app.route('/lesson', lessonRoute);
app.route('/product', productRoute);
app.route('/student/order', orderRoute);
app.route('/student/product', studentProductRoute);
app.route('/student/course', studentCourseRoute);
app.route('/purchase', purchaseRoute);
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
