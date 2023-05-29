import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function projectsRoutes(app: FastifyInstance) {
  app.get('/projects', async (request) => {
    const projects = await prisma.project.findMany()

    return Promise.all(
      projects.map(async (project) => {
        const projectStacks = await prisma.stack.findMany({
          where: { id_project: project.id },
        })

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          repo: project.repo,
          live: project.live,
          coverUrl: project.coverUrl,
          createdAt: project.created_at,
          stacks: projectStacks.map((stack) => stack.name),
        }
      }),
    )
  })

  app.get('/projects/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
    })

    const stacks = await prisma.stack.findMany({
      where: { id_project: project.id },
    })

    return {
      project,
      stacks: stacks.map((stack) => stack.name),
    }
  })

  app.post('/projects', async (request) => {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      repo: z.string(),
      live: z.string(),
      coverUrl: z.string(),
      stacks: z.string().array(),
    })

    const { title, description, repo, live, coverUrl, stacks } =
      bodySchema.parse(request.body)

    const project = await prisma.project.create({
      data: {
        title,
        description,
        repo,
        live,
        coverUrl,
      },
    })

    stacks.map(async (name) => {
      await prisma.stack.create({
        data: {
          name,
          id_project: project.id,
        },
      })
    })

    return { project, stacks }
  })

  app.put('/projects/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      repo: z.string(),
      live: z.string(),
      coverUrl: z.string(),
      stacks: z.string().array(),
    })

    const { title, description, repo, live, coverUrl, stacks } =
      bodySchema.parse(request.body)

    let project = await prisma.project.findUniqueOrThrow({
      where: {
        id,
      },
    })

    project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        repo,
        live,
        coverUrl,
      },
    })

    await prisma.stack.deleteMany({
      where: {
        id_project: id,
      },
    })

    stacks.map(async (name) => {
      await prisma.stack.create({
        data: {
          name,
          id_project: id,
        },
      })
    })

    return { project, stacks }
  })

  app.delete('/projects/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.stack.deleteMany({
      where: {
        id_project: id,
      },
    })

    await prisma.project.delete({
      where: {
        id,
      },
    })

    return reply.status(200).send()
  })
}
