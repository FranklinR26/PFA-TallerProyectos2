import { rest } from 'msw'

export const handlers = [
  rest.get('/api/portal', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ user: { name: 'Test User', role: 'docente' }, courses: [] })
    )
  }),
]
