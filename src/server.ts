import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'

import { projectsRoutes } from './routes/projects'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: ['http://localhost:3000'],
})

app.register(projectsRoutes)
app.register(uploadRoutes)

app
  .listen({
    port: Number(process.env.PORT) || 3333,
  })
  .then(() => {
    console.log('🚀 HTPP server running on http://localhost:3333')
  })
