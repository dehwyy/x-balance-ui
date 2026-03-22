import { HttpResponse, http } from 'msw'
import { mockDb } from '../store/mockDb'

export const usersHandlers = [
  http.get('/v1/users', () => {
    return HttpResponse.json({ users: mockDb.users })
  }),

  http.get('/v1/users/:id', ({ params }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({ user })
  }),

  http.post('/v1/users', async ({ request }) => {
    const body = (await request.json()) as { name: string; overdraftLimit: string }
    const user = mockDb.createUser({ name: body.name, overdraftLimit: body.overdraftLimit })
    return HttpResponse.json({ user }, { status: 201 })
  }),

  http.put('/v1/users/:id', async ({ params, request }) => {
    const body = (await request.json()) as { name?: string; overdraftLimit?: string }
    const user = mockDb.updateUser(params.id as string, body)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({ user })
  }),

  http.delete('/v1/users/:id', ({ params }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    mockDb.deleteUser(params.id as string)
    return HttpResponse.json({})
  }),
]
