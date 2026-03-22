import { HttpResponse, http } from 'msw'
import { mockDb } from '../store/mockDb'

export const balanceHandlers = [
  http.get('/v1/users/:id/balance', ({ params }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const balance = mockDb.getBalance(params.id as string)
    return HttpResponse.json(balance)
  }),

  http.post('/v1/users/:id/balance/credit', async ({ params, request }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const body = (await request.json()) as { amount: string; transactionId: string }
    try {
      const newBalance = mockDb.creditBalance(params.id as string, body.amount, body.transactionId)
      return HttpResponse.json({ newBalance, transactionId: body.transactionId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed'
      return HttpResponse.json({ message }, { status: 400 })
    }
  }),

  http.post('/v1/users/:id/balance/debit', async ({ params, request }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const body = (await request.json()) as { amount: string; transactionId: string }
    try {
      const newBalance = mockDb.debitBalance(params.id as string, body.amount, body.transactionId)
      return HttpResponse.json({ newBalance, transactionId: body.transactionId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed'
      return HttpResponse.json({ message }, { status: 400 })
    }
  }),

  http.post('/v1/users/:id/balance/freeze', async ({ params, request }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const body = (await request.json()) as {
      amount: string
      transactionId: string
      freezeTimeoutSeconds?: number
    }
    try {
      const result = mockDb.freezeBalance(params.id as string, body.amount, body.transactionId)
      return HttpResponse.json({ ...result, transactionId: body.transactionId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed'
      return HttpResponse.json({ message }, { status: 400 })
    }
  }),

  http.post('/v1/users/:id/balance/unfreeze', async ({ params, request }) => {
    const user = mockDb.findUser(params.id as string)
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const body = (await request.json()) as { transactionId: string }
    try {
      const result = mockDb.unfreezeBalance(params.id as string, body.transactionId)
      return HttpResponse.json({ ...result, transactionId: body.transactionId })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed'
      return HttpResponse.json({ message }, { status: 400 })
    }
  }),
]
